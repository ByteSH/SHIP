package com.connect.SHIP_ADMIN.service;

import com.connect.SHIP_ADMIN.dto.ProductDetailsResponse;
import com.connect.SHIP_ADMIN.entity.ProductEntity;
import com.connect.SHIP_ADMIN.entity.ProductImageEntity;
import com.connect.SHIP_ADMIN.repository.ProductImageRepository;
import com.connect.SHIP_ADMIN.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public List<ProductDetailsResponse> getAllProductsService(String category) {
        List<ProductEntity> products = productRepository.findByCategory(category);

        return products.stream().map(product -> {

            List<String> images = productImageRepository.findByUniqueId(product.getUniqueId())
                    .stream()
                    .map(ProductImageEntity::getImagePath)
                    .collect(Collectors.toList());

            return ProductDetailsResponse.builder()
                    .uniqueId(product.getUniqueId())
                    .productName(product.getProductName())
                    .companyName(product.getCompanyName())
                    .category(product.getCategory())
                    .subCategory(product.getSubCategory())
                    .unit(product.getUnit())
                    .value(product.getValue())
                    .mrp(product.getMrp())
                    .sellerMrp(product.getSellerMrp())
                    .purchaseMrp(product.getPurchaseMrp())
                    .images(images)
                    .build();
        }).collect(Collectors.toList());
    }
}