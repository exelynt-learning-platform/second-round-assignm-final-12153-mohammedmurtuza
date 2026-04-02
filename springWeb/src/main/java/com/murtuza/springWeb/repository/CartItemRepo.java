package com.murtuza.springWeb.repository;

import com.murtuza.springWeb.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepo extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserEmail(String email);
    Optional<CartItem> findByUserEmailAndProductId(String email, Integer productId);
    Optional<CartItem> findByIdAndUserEmail(Long id, String email);
}
