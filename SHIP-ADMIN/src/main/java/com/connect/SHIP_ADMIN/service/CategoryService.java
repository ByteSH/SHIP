package com.connect.SHIP_ADMIN.service;

import com.connect.SHIP_ADMIN.dto.CategoryImageResponse;
import com.connect.SHIP_ADMIN.entity.CategoryImageEntity;
import com.connect.SHIP_ADMIN.repository.CategoryImageRepository;
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
}
