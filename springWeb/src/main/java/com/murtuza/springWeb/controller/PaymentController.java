package com.murtuza.springWeb.controller;

import com.murtuza.springWeb.dto.RazorpayOrderResponse;
import com.murtuza.springWeb.dto.RazorpayVerifyRequest;
import com.murtuza.springWeb.service.RazorpayService;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments/razorpay")
public class PaymentController {

    private final RazorpayService razorpayService;

    @Value("${razorpay.webhook-secret}")
    private String webhookSecret;

    public PaymentController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/create-order/{orderId}")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@PathVariable Long orderId) throws Exception {
        return ResponseEntity.ok(razorpayService.createRazorpayOrder(orderId));
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, String>> verify(@RequestBody RazorpayVerifyRequest request) throws Exception {
        razorpayService.verifyAndMarkPaid(request);
        return ResponseEntity.ok(Map.of("message", "Payment verified"));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, String>> webhook(@RequestBody String payload,
                                                       @RequestHeader("X-Razorpay-Signature") String signature) {
        try {
            boolean valid = Utils.verifyWebhookSignature(payload, signature, webhookSecret);
            if (!valid) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid webhook signature"));
            }

            JSONObject root = new JSONObject(payload);
            String event = root.getString("event");

            if ("payment.failed".equals(event)) {
                String gatewayOrderId = root.getJSONObject("payload")
                        .getJSONObject("payment")
                        .getJSONObject("entity")
                        .optString("order_id", null);

                if (gatewayOrderId != null && !gatewayOrderId.isBlank()) {
                    razorpayService.markFailedByGatewayOrderId(gatewayOrderId);
                }
            }

            return ResponseEntity.ok(Map.of("message", "Webhook processed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
