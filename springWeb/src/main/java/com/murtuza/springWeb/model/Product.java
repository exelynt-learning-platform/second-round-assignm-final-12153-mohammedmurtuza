package com.murtuza.springWeb.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String about;
    private String brand;

    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    // keep old DB column name if already created
    @Column(name = "categary")
    private String category;

    // if you keep String date, JsonFormat is optional
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private String releaseDate;

    private boolean available;
    private long quantity;

    private String imageName;
    private String imageType;

    @Lob
    private byte[] imageData;

    private int likes;

    // ---- backward-compatible helper methods (if old code uses cate/imageDate names) ----
    public String getCate() {
        return this.category;
    }

    public void setCate(String cate) {
        this.category = cate;
    }

    public byte[] getImageDate() {
        return this.imageData;
    }

    public void setImageDate(byte[] imageDate) {
        this.imageData = imageDate;
    }
}