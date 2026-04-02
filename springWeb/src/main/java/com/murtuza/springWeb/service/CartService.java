package com.murtuza.springWeb.service;

import com.murtuza.springWeb.dto.CartItemResponse;
import com.murtuza.springWeb.model.CartItem;
import com.murtuza.springWeb.model.Product;
import com.murtuza.springWeb.model.User;
import com.murtuza.springWeb.repository.CartItemRepo;
import com.murtuza.springWeb.repository.ProductRepo;
import com.murtuza.springWeb.repository.UserRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepo cartItemRepo;
    private final ProductRepo productRepo;
    private final UserRepo userRepo;

    public CartService(CartItemRepo cartItemRepo, ProductRepo productRepo, UserRepo userRepo) {
        this.cartItemRepo = cartItemRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private User currentUser() {
        return userRepo.findByEmail(currentEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<CartItemResponse> getMyCart() {
        return cartItemRepo.findByUserEmail(currentEmail()).stream().map(this::toResponse).toList();
    }

    public CartItemResponse addToCart(Integer productId, Integer qty) {
        if (qty == null || qty < 1) {
            throw new RuntimeException("Quantity must be >= 1");
        }

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.isAvailable()) {
            throw new RuntimeException("Product not available");
        }
        if (product.getQuantity() < qty) {
            throw new RuntimeException("Insufficient stock");
        }

        String email = currentEmail();
        CartItem item = cartItemRepo.findByUserEmailAndProductId(email, productId).orElse(null);

        if (item == null) {
            item = new CartItem();
            item.setUser(currentUser());
            item.setProduct(product);
            item.setQuantity(qty);
        } else {
            int newQty = item.getQuantity() + qty;
            if (product.getQuantity() < newQty) {
                throw new RuntimeException("Insufficient stock");
            }
            item.setQuantity(newQty);
        }

        return toResponse(cartItemRepo.save(item));
    }

    public CartItemResponse updateQuantity(Long cartItemId, Integer qty) {
        if (qty == null || qty < 1) {
            throw new RuntimeException("Quantity must be >= 1");
        }

        CartItem item = cartItemRepo.findByIdAndUserEmail(cartItemId, currentEmail())
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (item.getProduct().getQuantity() < qty) {
            throw new RuntimeException("Insufficient stock");
        }

        item.setQuantity(qty);
        return toResponse(cartItemRepo.save(item));
    }

    public void removeItem(Long cartItemId) {
        CartItem item = cartItemRepo.findByIdAndUserEmail(cartItemId, currentEmail())
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cartItemRepo.delete(item);
    }

    public void clearMyCart() {
        cartItemRepo.deleteAll(cartItemRepo.findByUserEmail(currentEmail()));
    }

    private CartItemResponse toResponse(CartItem item) {
        BigDecimal price = item.getProduct().getPrice() == null ? BigDecimal.ZERO : item.getProduct().getPrice();
        BigDecimal lineTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                price,
                item.getQuantity(),
                lineTotal
        );
    }
}
