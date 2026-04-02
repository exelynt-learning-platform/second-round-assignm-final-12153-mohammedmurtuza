package com.murtuza.springWeb.repository;

import com.murtuza.springWeb.model.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepo extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByUserEmailOrderByIdDesc(String email);
    Optional<OrderEntity> findByIdAndUserEmail(Long id, String email);
    Optional<OrderEntity> findByGatewayOrderId(String gatewayOrderId);
}
