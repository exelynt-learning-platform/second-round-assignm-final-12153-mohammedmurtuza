package com.murtuza.springWeb.dto;

import com.murtuza.springWeb.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private BigDecimal totalPrice;
    private String shippingDetails;
    private PaymentStatus paymentStatus;
    private List<OrderItemResponse> items;
}
