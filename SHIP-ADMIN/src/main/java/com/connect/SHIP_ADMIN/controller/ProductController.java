package com.connect.SHIP_ADMIN.controller;

import com.connect.SHIP_ADMIN.dto.ProductDetailsResponse;
import com.connect.SHIP_ADMIN.dto.ProductRequestDTO;
import com.connect.SHIP_ADMIN.entity.ProductEntity;
import com.connect.SHIP_ADMIN.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/names/{category}")
    public ResponseEntity<List<ProductDetailsResponse>> getAllProducts(@PathVariable String category) {
        return ResponseEntity.ok(productService.getAllProductsService(category));
    }

    @PostMapping("/add")
    public ResponseEntity<ProductDetailsResponse> addProduct(
            @RequestPart("product") ProductEntity product,
            @RequestPart("images") MultipartFile[] images) throws IOException {

        return ResponseEntity.ok(productService.addProduct(product, images));
    }


    @PostMapping("/add-with-urls")
    public ResponseEntity<ProductDetailsResponse> addProductWithUrls(@RequestBody ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.addProductWithUrls(dto));
    }

    @DeleteMapping("/delete/{uniqueId}")
    public ResponseEntity<String> deleteProduct(@PathVariable String uniqueId) {
        productService.deleteProductByUniqueId(uniqueId);
        return ResponseEntity.ok("Product with ID " + uniqueId + " deleted successfully.");
    }


    @PutMapping("/edit/{uniqueId}")
    public ResponseEntity<ProductDetailsResponse> updateProduct(
            @PathVariable String uniqueId,
            @RequestBody ProductRequestDTO dto) {

        return ResponseEntity.ok(productService.updateProductWithUrls(uniqueId, dto));
    }
}