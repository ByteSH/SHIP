package com.connect.SHIP_ADMIN.controller;

import com.connect.SHIP_ADMIN.dto.ProductDetailsResponse;
import com.connect.SHIP_ADMIN.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
}