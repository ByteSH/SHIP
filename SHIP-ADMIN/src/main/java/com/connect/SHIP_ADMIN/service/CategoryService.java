package com.connect.SHIP_ADMIN.service;

import com.connect.SHIP_ADMIN.dto.CategoryImageResponse;
import com.connect.SHIP_ADMIN.entity.CategoryImageEntity;
import com.connect.SHIP_ADMIN.repository.CategoryImageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryImageRepository categoryImageRepository;
    private final SupabaseStorageService storageService;

    public List<CategoryImageResponse> getAllCategories(){

        return categoryImageRepository.findAll().stream()
                .map(entity -> CategoryImageResponse.builder()
                        .category(entity.getCategory())
                        .imagePath(entity.getImagePath())
                        .build())
                .collect(Collectors.toList());
    }


    public CategoryImageResponse addCategory(String categoryName, MultipartFile image) throws IOException {
        String publicUrl = storageService.uploadFile(image, "categories");

        CategoryImageEntity entity = CategoryImageEntity.builder()
                .category(categoryName)
                .imagePath(publicUrl)
                .build();

        categoryImageRepository.save(entity);

        return CategoryImageResponse.builder()
                .category(entity.getCategory())
                .imagePath(entity.getImagePath())
                .build();
    }


    public CategoryImageResponse addCategoryWithUrl(String categoryName, String imageUrl) {
        CategoryImageEntity entity = CategoryImageEntity.builder()
                .category(categoryName)
                .imagePath(imageUrl)
                .build();

        categoryImageRepository.save(entity);

        return CategoryImageResponse.builder()
                .category(entity.getCategory())
                .imagePath(entity.getImagePath())
                .build();
    }


    @Transactional
    public CategoryImageResponse updateCategory(String oldCategoryName, String newCategoryName, String newImageUrl) {
        // 1. Purani category dhundna
        CategoryImageEntity existingCategory = categoryImageRepository.findByCategory(oldCategoryName)
                .orElseThrow(() -> new RuntimeException("Category not found: " + oldCategoryName));

        // 2. Details update karna
        existingCategory.setCategory(newCategoryName);
        existingCategory.setImagePath(newImageUrl);

        categoryImageRepository.save(existingCategory);

        return CategoryImageResponse.builder()
                .category(existingCategory.getCategory())
                .imagePath(existingCategory.getImagePath())
                .build();
    }

    @Transactional
    public void deleteCategory(String categoryName) {
        if (!categoryImageRepository.existsByCategory(categoryName)) {
            throw new RuntimeException("Category not found: " + categoryName);
        }
        categoryImageRepository.deleteByCategory(categoryName);
    }
}
