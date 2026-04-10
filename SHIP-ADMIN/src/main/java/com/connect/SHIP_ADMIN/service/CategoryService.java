package com.connect.SHIP_ADMIN.service;

import com.connect.SHIP_ADMIN.dto.CategoryImageResponse;
import com.connect.SHIP_ADMIN.repository.CategoryImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryImageRepository categoryImageRepository;

    public List<CategoryImageResponse> getAllCategories(){

        return categoryImageRepository.findAll().stream()
                .map(entity -> CategoryImageResponse.builder()
                        .category(entity.getCategory())
                        .imagePath(entity.getImagePath())
                        .build())
                .collect(Collectors.toList());
    }
}
