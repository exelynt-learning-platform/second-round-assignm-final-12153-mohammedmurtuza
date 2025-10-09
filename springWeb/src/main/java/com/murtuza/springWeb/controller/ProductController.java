package com.murtuza.springWeb.controller;

import java.util.List;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.murtuza.springWeb.model.Product;
import com.murtuza.springWeb.service.ProductService;



@RestController
@CrossOrigin
@RequestMapping("/api")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    

    @RequestMapping("/")
    public String greet() {
        return "hi there";
    }

    @GetMapping("/Products")
    public List<Product> getAllProducts() {
        System.out.println("working on getAllProducts");
        return service.getAllProducts();
    }

    @GetMapping("/Products/{id}")
    public Product getProducts(@PathVariable int id) {
        System.out.println("working on getProducts");
        return service.getProducts(id);
    }

    @PostMapping("/Product")
    public ResponseEntity<?> addProduct(
            @RequestPart Product product,
            @RequestPart MultipartFile imageFile) {
        System.out.println("working on postMapping");

        try {
            Product product1 = service.addProduct(product, imageFile);
            return new ResponseEntity<>(product1, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/Product/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable int id,
            @RequestPart Product product,
            @RequestPart MultipartFile imageFile) {
        System.out.println("working on updateProduct mapping for ID: " + id);

        try {
            Product updatedProduct = service.updateProduct(id, product, imageFile);
            return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/Product/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable int id){
        System.out.println("working on delete api");

        try{
            boolean deleteProduct = service.deleteProduct(id);
            return new ResponseEntity<>(deleteProduct,HttpStatus.OK);
        }

        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @GetMapping("/Products/search")
    public ResponseEntity<List<Product>>searchProduct(@RequestParam String keyword){
        System.out.println("working on a search feature");
            List<Product> searchProduct1 =  service.searchProduct(keyword);
        return new ResponseEntity<>(searchProduct1, HttpStatus.OK);
    }

    @GetMapping("/csrf-token")
    public CsrfToken getCsrfToken(HttpServletRequest request) {
        return (CsrfToken) request.getAttribute("_csrf");

    }



        //Searching a product in the search bar with keyword that fetch by the params

//    @GetMapping("/product/keyword")
//    public ResponseEntity<List<Product>> searchProduct(@RequestParam String keyword){
//        List<Product> products = service.searchProduct(keyword);
//        return new ResponseEntity<>(products,HttpStatus.OK);
//
//
//    }
//    @PostMapping("/product/{id}")
//    public ResponseEntity<byte[]> getImage(@PathVariable int id){
//        Product product = service.getImage(id);
//        byte imageFile = product.getImageDate();
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.valueOf(product.getImageType())).body(imageFile);
//
//    }

//    @GetMapping("/product/{id}/image")
//    public
}
