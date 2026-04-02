package com.murtuza.springWeb.controller;

import com.murtuza.springWeb.dto.OrderResponse;
import com.murtuza.springWeb.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/place")
    public ResponseEntity<OrderResponse> place(@RequestParam(required = false) String shippingDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(shippingDetails));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> myOrders() {
        return ResponseEntity.ok(orderService.myOrders());
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> myOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.myOrderById(orderId));
    }
}