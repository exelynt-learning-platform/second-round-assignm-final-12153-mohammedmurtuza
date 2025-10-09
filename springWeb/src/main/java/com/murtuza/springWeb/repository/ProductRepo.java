package com.murtuza.springWeb.repository;

import com.murtuza.springWeb.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {
    //jpql (Java Persistance query language)
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE CONCAT('%', :keyword, '%') OR " +
            "LOWER(p.brand) LIKE CONCAT('%', :keyword, '%') OR " +
            "LOWER(p.cate) LIKE CONCAT('%', :keyword, '%')")

    List<Product> searchProducts(@Param("keyword") String keyword);



}
