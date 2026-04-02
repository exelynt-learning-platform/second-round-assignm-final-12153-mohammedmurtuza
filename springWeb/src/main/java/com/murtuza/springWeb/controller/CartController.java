package com.murtuza.springWeb.controller;

import com.murtuza.springWeb.dto.CartItemResponse;
import com.murtuza.springWeb.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> myCart() {
        return ResponseEntity.ok(cartService.getMyCart());
    }

    @PostMapping("/add")
    public ResponseEntity<CartItemResponse> add(@RequestParam Integer productId, @RequestParam Integer qty) {
        return ResponseEntity.ok(cartService.addToCart(productId, qty));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItemResponse> updateQty(@PathVariable Long cartItemId, @RequestParam Integer qty) {
        return ResponseEntity.ok(cartService.updateQuantity(cartItemId, qty));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Map<String, String>> remove(@PathVariable Long cartItemId) {
        cartService.removeItem(cartItemId);
        return ResponseEntity.ok(Map.of("message", "Item removed"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clear() {
        cartService.clearMyCart();
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}