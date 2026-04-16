package com.connect.SHIP_ADMIN.features.category;

import com.connect.SHIP_ADMIN.infrastructure.storage.SupabaseStorageService;
import com.connect.SHIP_ADMIN.core.exception.CategoryNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for managing category operations and their associated images.
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryImageRepository categoryImageRepository;
    private final SupabaseStorageService storageService;

    /**
     * Retrieves all categories and their image paths.
     */
    public List<CategoryImageResponse> getAllCategories(){

        return categoryImageRepository.findAll().stream()
                .map(entity -> CategoryImageResponse.builder()
                        .category(entity.getCategory())
                        .imagePath(entity.getImagePath())
                        .build())
                .collect(Collectors.toList());
    }


    /**
     * Adds a new category by uploading an image file to Supabase storage.
     */
    public CategoryImageResponse addCategory(String categoryName, MultipartFile image) throws IOException {
        String publicUrl = storageService.uploadFile(image, "categories");

        CategoryImage entity = CategoryImage.builder()
                .category(categoryName)
                .imagePath(publicUrl)
                .build();

        categoryImageRepository.save(entity);

        return CategoryImageResponse.builder()
                .category(entity.getCategory())
                .imagePath(entity.getImagePath())
                .build();
    }


    /**
     * Adds a new category using an existing image URL instead of an upload.
     */
    public CategoryImageResponse addCategoryWithUrl(String categoryName, String imageUrl) {
        CategoryImage entity = CategoryImage.builder()
                .category(categoryName)
                .imagePath(imageUrl)
                .build();

        categoryImageRepository.save(entity);

        return CategoryImageResponse.builder()
                .category(entity.getCategory())
                .imagePath(entity.getImagePath())
                .build();
    }


    /**
     * Updates an existing category's name and image URL.
     */
    @Transactional
    public CategoryImageResponse updateCategory(String oldCategoryName, String newCategoryName, String newImageUrl) {
        // Find existing category
        CategoryImage existingCategory = categoryImageRepository.findByCategory(oldCategoryName)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found: " + oldCategoryName));

        // Update details
        existingCategory.setCategory(newCategoryName);
        existingCategory.setImagePath(newImageUrl);

        categoryImageRepository.save(existingCategory);

        return CategoryImageResponse.builder()
                .category(existingCategory.getCategory())
                .imagePath(existingCategory.getImagePath())
                .build();
    }

    /**
     * Deletes a category by its name if it exists.
     */
    @Transactional
    public void deleteCategory(String categoryName) {
        if (!categoryImageRepository.existsByCategory(categoryName)) {
            throw new CategoryNotFoundException("Category not found: " + categoryName);
        }
        categoryImageRepository.deleteByCategory(categoryName);
    }
}
