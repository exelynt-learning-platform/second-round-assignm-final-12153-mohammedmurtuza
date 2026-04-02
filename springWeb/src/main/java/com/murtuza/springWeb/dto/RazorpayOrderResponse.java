package com.murtuza.springWeb.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RazorpayOrderResponse {
    private Long appOrderId;
    private String razorpayOrderId;
    private Long amount;
    private String currency;
    private String keyId;
}
