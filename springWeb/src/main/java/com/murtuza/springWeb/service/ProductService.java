package com.murtuza.springWeb.service;

import java.io.IOException;
import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.murtuza.springWeb.model.Product;
import com.murtuza.springWeb.repository.ProductRepo;



@Service
public class  ProductService {

    private ProductRepo repo;

    public ProductService(ProductRepo repo) {
        this.repo = repo;
    }

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProducts(int id) {
        return repo.findById(id).orElse(new Product());
    }


    public Product addProduct(Product product, MultipartFile imageFile)
        throws IOException {

            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            product.setImageDate(imageFile.getBytes());


            return repo.save(product);
        }

    public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {
        // First, check if the product exists
        Product existingProduct = repo.findById(id).orElse(null);
        if (existingProduct == null) {
            throw new RuntimeException("Product with ID " + id + " not found");
        }

        // Update the existing product with new data
        existingProduct.setName(product.getName());
        existingProduct.setAbout(product.getAbout());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCate(product.getCate());
        existingProduct.setReleaseDate(product.getReleaseDate());
        existingProduct.setAvailable(product.isAvailable());
        existingProduct.setQuantity(product.getQuantity());

        // Update image only if a new image file is provided
        if (imageFile != null && !imageFile.isEmpty()) {
            existingProduct.setImageName(imageFile.getOriginalFilename());
            existingProduct.setImageType(imageFile.getContentType());
            existingProduct.setImageDate(imageFile.getBytes());
        }
        // If no new image is provided, keep the existing image

        // Save and return the updated product
        return repo.save(existingProduct);
    }

    // Overloaded method for updating without image
    public Product updateProduct(int id, Product product) throws IOException {
        return updateProduct(id, product, null);
    }

    // Delete product method
    public boolean deleteProduct(int id) {
        try {
            if (repo.existsById(id)) {
                repo.deleteById(id);
                return true;
            }
            return false;
        } catch (Exception e) {
            throw new RuntimeException("Error deleting product with ID " + id + ": " + e.getMessage());
        }
    }

    public List<Product> searchProduct(@Param("keyword") String keyword) {
        return repo.searchProducts(keyword);
    }


//    public List<Product> searchProduct(String keyword) {
//       return repo.searchProduct(keyword);
//    }
}
//    @Autowired
//    ProductRepo repo;

//    //convert immutable into the mutable becouse we are performing the post (add the products operations)
//    List<Product> products = new ArrayList<>(Arrays.asList(new Product(101,"phone", 20000),
//            new Product(102,"laptop",2003)));
//
//
//    public List<Product> getproduct(){
//            return repo.findAll();
//    }
//
//
//    public Product getId(int id){
//        return repo.findById(id).orElse(new Product());
//    }
//
//
//
//    public void addProduct(Product prod){
//        repo.save(prod);
//    }
//
//
//
//    public void updateProduct(Product prod) {
//        repo.save(prod);
//    }
////        int index = 0;
////        for (int i = 0; i<products.size()-1; i++){
////            if(products.get(i).getId() == prod.getId()){
////                index  = i;
////            }
////        }
////        products.set(index,prod);
////    }
//
//    public void deleteProd(int id) {
//
//        repo.deleteById(id);
//    }
////        int index = 0;
////        for (int i = 0; i<products.size(); i++) {
////            if (products.get(i).getId() == id)
////                index = i;
////        }
////        products.remove(index);
////
////    }
//}
