package com.connect.SHIP_ADMIN.features.category;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * REST controller for managing product categories and associated images.
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Endpoint to fetch the complete list of all categories.
     */
    @GetMapping("/list")
    public ResponseEntity<List<CategoryImageResponse>> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    /**
     * Endpoint to create a new category via an image file upload.
     */
    @PostMapping("/add")
    public ResponseEntity<CategoryImageResponse> addCategory(
            @RequestParam("category") String category,
            @RequestParam("image") MultipartFile image) throws IOException {

        CategoryImageResponse response = categoryService.addCategory(category, image);
        return ResponseEntity.ok(response);
    }


    /**
     * Endpoint to create a new category using a provided image URL.
     */
    @PostMapping("/add-with-url")
    public ResponseEntity<CategoryImageResponse> addCategoryWithUrl(
            @RequestParam String category,
            @RequestParam String imageUrl) {
        return ResponseEntity.ok(categoryService.addCategoryWithUrl(category, imageUrl));
    }


    /**
     * Endpoint to modify the name and image URL of an existing category.
     */
    @PutMapping("/edit/{oldName}")
    public ResponseEntity<CategoryImageResponse> updateCategory(
            @PathVariable String oldName,
            @RequestParam String newCategoryName,
            @RequestParam String newImageUrl) {

        return ResponseEntity.ok(categoryService.updateCategory(oldName, newCategoryName, newImageUrl));
    }

    /**
     * Endpoint to delete a specific category by its name.
     */
    @DeleteMapping("/delete/{categoryName}")
    public ResponseEntity<String> deleteCategory(@PathVariable String categoryName) {
        categoryService.deleteCategory(categoryName);
        return ResponseEntity.ok("Category '" + categoryName + "' deleted successfully.");
    }

}