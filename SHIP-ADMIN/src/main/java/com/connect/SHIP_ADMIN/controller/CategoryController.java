package com.connect.SHIP_ADMIN.controller;

import com.connect.SHIP_ADMIN.dto.CategoryImageResponse;
import com.connect.SHIP_ADMIN.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
}