package com.murtuza.springWeb.dto;

import lombok.Data;

@Data
public class RazorpayVerifyRequest {
    private Long appOrderId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
