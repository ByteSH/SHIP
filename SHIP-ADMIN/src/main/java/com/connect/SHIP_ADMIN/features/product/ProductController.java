package com.connect.SHIP_ADMIN.features.product;

import com.connect.SHIP_ADMIN.features.product.dto.ProductRequest;
import com.connect.SHIP_ADMIN.features.product.dto.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * REST controller for managing product inventories and their images.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Endpoint to fetch all products belonging to a specific category.
     */
    @GetMapping("/names/{category}")
    public ResponseEntity<List<ProductResponse>> getAllProducts(@PathVariable String category) {
        return ResponseEntity.ok(productService.getAllProductsService(category));
    }

    /**
     * Endpoint to add a new product and upload its image files.
     */
    @PostMapping("/add")
    public ResponseEntity<ProductResponse> addProduct(
            @RequestPart("product") ProductRequest productDto,
            @RequestPart("images") MultipartFile[] images) throws IOException {

        return ResponseEntity.ok(productService.addProduct(productDto, images));
    }

    /**
     * Endpoint to add a new product by providing direct image URLs.
     */
    @PostMapping("/add-with-urls")
    public ResponseEntity<ProductResponse> addProductWithUrls(@RequestBody ProductRequest dto) {
        return ResponseEntity.ok(productService.addProductWithUrls(dto));
    }

    /**
     * Endpoint to delete a product based on its unique generated identifier.
     */
    @DeleteMapping("/delete/{uniqueId}")
    public ResponseEntity<String> deleteProduct(@PathVariable String uniqueId) {
        productService.deleteProductByUniqueId(uniqueId);
        return ResponseEntity.ok("Product with ID " + uniqueId + " deleted successfully.");
    }


    /**
     * Endpoint to update the details and image URLs of an existing product.
     */
    @PutMapping("/edit/{uniqueId}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable String uniqueId,
            @RequestBody ProductRequest dto) {

        return ResponseEntity.ok(productService.updateProductWithUrls(uniqueId, dto));
    }
}