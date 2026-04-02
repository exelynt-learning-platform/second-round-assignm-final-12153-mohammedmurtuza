package com.murtuza.springWeb.service;

import com.murtuza.springWeb.dto.OrderItemResponse;
import com.murtuza.springWeb.dto.OrderResponse;
import com.murtuza.springWeb.model.*;
import com.murtuza.springWeb.repository.CartItemRepo;
import com.murtuza.springWeb.repository.OrderRepo;
import com.murtuza.springWeb.repository.ProductRepo;
import com.murtuza.springWeb.repository.UserRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final CartItemRepo cartItemRepo;
    private final OrderRepo orderRepo;
    private final ProductRepo productRepo;
    private final UserRepo userRepo;

    public OrderService(CartItemRepo cartItemRepo, OrderRepo orderRepo, ProductRepo productRepo, UserRepo userRepo) {
        this.cartItemRepo = cartItemRepo;
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Transactional
    public OrderResponse placeOrder(String shippingDetails) {
        String email = currentEmail();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepo.findByUserEmail(email);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setShippingDetails(shippingDetails);
        order.setPaymentStatus(PaymentStatus.PENDING);

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem ci : cartItems) {
            Product p = ci.getProduct();
            if (p.getQuantity() < ci.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + p.getName());
            }

            p.setQuantity(p.getQuantity() - ci.getQuantity());
            if (p.getQuantity() == 0) {
                p.setAvailable(false);
            }
            productRepo.save(p);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(p);
            item.setQuantity(ci.getQuantity());
            item.setUnitPrice(p.getPrice());

            order.getItems().add(item);
            total = total.add(p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
        }

        order.setTotalPrice(total);
        OrderEntity saved = orderRepo.save(order);
        cartItemRepo.deleteAll(cartItems);

        return toResponse(saved);
    }

    public List<OrderResponse> myOrders() {
        return orderRepo.findByUserEmailOrderByIdDesc(currentEmail()).stream().map(this::toResponse).toList();
    }

    public OrderResponse myOrderById(Long orderId) {
        OrderEntity order = orderRepo.findByIdAndUserEmail(orderId, currentEmail())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return toResponse(order);
    }

    private OrderResponse toResponse(OrderEntity order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(i -> new OrderItemResponse(
                        i.getId(),
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getUnitPrice(),
                        i.getUnitPrice().multiply(BigDecimal.valueOf(i.getQuantity()))
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getTotalPrice(),
                order.getShippingDetails(),
                order.getPaymentStatus(),
                items
        );
    }
}
