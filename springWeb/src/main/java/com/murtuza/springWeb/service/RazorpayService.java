package com.murtuza.springWeb.service;

import com.murtuza.springWeb.dto.RazorpayOrderResponse;
import com.murtuza.springWeb.dto.RazorpayVerifyRequest;
import com.murtuza.springWeb.model.OrderEntity;
import com.murtuza.springWeb.model.PaymentStatus;
import com.murtuza.springWeb.repository.OrderRepo;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class RazorpayService {

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    private final OrderRepo orderRepo;

    public RazorpayService(OrderRepo orderRepo) {
        this.orderRepo = orderRepo;
    }

    @Transactional
    public RazorpayOrderResponse createRazorpayOrder(Long appOrderId) throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        OrderEntity appOrder = orderRepo.findByIdAndUserEmail(appOrderId, email)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (appOrder.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Order already paid");
        }

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        long amountPaise = appOrder.getTotalPrice()
                .multiply(BigDecimal.valueOf(100))
                .longValue();

        JSONObject options = new JSONObject();
        options.put("amount", amountPaise);
        options.put("currency", "INR");
        options.put("receipt", "order_" + appOrder.getId());
        options.put("payment_capture", 1);

        Order rzpOrder = client.orders.create(options);

        String razorpayOrderId = rzpOrder.get("id");
        appOrder.setGatewayOrderId(razorpayOrderId);
        appOrder.setPaymentStatus(PaymentStatus.PENDING);
        orderRepo.save(appOrder);

        return new RazorpayOrderResponse(
                appOrder.getId(),
                razorpayOrderId,
                amountPaise,
                "INR",
                keyId
        );
    }

    @Transactional
    public void verifyAndMarkPaid(RazorpayVerifyRequest req) throws Exception {
        OrderEntity appOrder = orderRepo.findById(req.getAppOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        JSONObject json = new JSONObject();
        json.put("razorpay_order_id", req.getRazorpayOrderId());
        json.put("razorpay_payment_id", req.getRazorpayPaymentId());
        json.put("razorpay_signature", req.getRazorpaySignature());

        boolean valid = Utils.verifyPaymentSignature(json, keySecret);
        if (!valid) {
            throw new RuntimeException("Invalid payment signature");
        }

        appOrder.setGatewayOrderId(req.getRazorpayOrderId());
        appOrder.setGatewayPaymentId(req.getRazorpayPaymentId());
        appOrder.setPaymentStatus(PaymentStatus.PAID);
        orderRepo.save(appOrder);
    }

    @Transactional
    public void markFailedByGatewayOrderId(String gatewayOrderId) {
        orderRepo.findByGatewayOrderId(gatewayOrderId).ifPresent(order -> {
            order.setPaymentStatus(PaymentStatus.FAILED);
            orderRepo.save(order);
        });
    }
}
