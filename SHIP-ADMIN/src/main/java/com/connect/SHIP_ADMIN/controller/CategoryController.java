package com.connect.SHIP_ADMIN.controller;

import com.connect.SHIP_ADMIN.dto.CategoryImageResponse;
import com.connect.SHIP_ADMIN.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/list")
    public ResponseEntity<List<CategoryImageResponse>> getCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/add")
    public ResponseEntity<CategoryImageResponse> addCategory(
            @RequestParam("category") String category,
            @RequestParam("image") MultipartFile image) throws IOException {

        CategoryImageResponse response = categoryService.addCategory(category, image);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/add-with-url")
    public ResponseEntity<CategoryImageResponse> addCategoryWithUrl(
            @RequestParam String category,
            @RequestParam String imageUrl) {
        return ResponseEntity.ok(categoryService.addCategoryWithUrl(category, imageUrl));
    }


    @PutMapping("/edit/{oldName}")
    public ResponseEntity<CategoryImageResponse> updateCategory(
            @PathVariable String oldName,
            @RequestParam String newCategoryName,
            @RequestParam String newImageUrl) {

        return ResponseEntity.ok(categoryService.updateCategory(oldName, newCategoryName, newImageUrl));
    }

    @DeleteMapping("/delete/{categoryName}")
    public ResponseEntity<String> deleteCategory(@PathVariable String categoryName) {
        categoryService.deleteCategory(categoryName);
        return ResponseEntity.ok("Category '" + categoryName + "' deleted successfully.");
    }

}