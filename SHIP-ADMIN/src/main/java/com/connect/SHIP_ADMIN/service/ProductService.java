package com.connect.SHIP_ADMIN.service;

import com.connect.SHIP_ADMIN.dto.ProductDetailsResponse;
import com.connect.SHIP_ADMIN.dto.ProductRequestDTO;
import com.connect.SHIP_ADMIN.entity.ProductEntity;
import com.connect.SHIP_ADMIN.entity.ProductImageEntity;
import com.connect.SHIP_ADMIN.repository.ProductImageRepository;
import com.connect.SHIP_ADMIN.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final SupabaseStorageService storageService;

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



    @Transactional
    public ProductDetailsResponse addProduct(ProductEntity productData, MultipartFile[] images) throws IOException {

        ProductEntity savedProduct = productRepository.save(productData);
        List<String> uploadedUrls = new ArrayList<>();

        for (int i = 0; i < images.length; i++) {
            String url = storageService.uploadFile(images[i], "products");
            uploadedUrls.add(url);

            ProductImageEntity imageEntity = ProductImageEntity.builder()
                    .uniqueId(savedProduct.getUniqueId())
                    .category(savedProduct.getCategory())
                    .imagePath(url)
                    .isPrimary(i == 0)
                    .build();

            productImageRepository.save(imageEntity);
        }

        return ProductDetailsResponse.builder()
                .uniqueId(savedProduct.getUniqueId())
                .productName(savedProduct.getProductName())
                .companyName(savedProduct.getCompanyName())
                .category(savedProduct.getCategory())
                .subCategory(savedProduct.getSubCategory())
                .unit(savedProduct.getUnit())
                .value(savedProduct.getValue())
                .mrp(savedProduct.getMrp())
                .sellerMrp(savedProduct.getSellerMrp())
                .purchaseMrp(savedProduct.getPurchaseMrp())
                .images(uploadedUrls)
                .build();
    }


    @Transactional
    public ProductDetailsResponse addProductWithUrls(ProductRequestDTO dto) {
        ProductEntity product = ProductEntity.builder()
                .uniqueId(dto.getUniqueId())
                .category(dto.getCategory())
                .subCategory(dto.getSubCategory())
                .productName(dto.getProductName())
                .companyName(dto.getCompanyName())
                .unit(dto.getUnit())
                .value(dto.getValue())
                .mrp(dto.getMrp())
                .sellerMrp(dto.getSellerMrp())
                .purchaseMrp(dto.getPurchaseMrp())
                .build();

        productRepository.save(product);

        for (int i = 0; i < dto.getImageUrls().size(); i++) {
            ProductImageEntity imageEntity = ProductImageEntity.builder()
                    .uniqueId(dto.getUniqueId())
                    .category(dto.getCategory())
                    .imagePath(dto.getImageUrls().get(i))
                    .isPrimary(i == 0)
                    .build();
            productImageRepository.save(imageEntity);
        }

        return mapToResponse(product, dto.getImageUrls());
    }

    private ProductDetailsResponse mapToResponse(ProductEntity product, List<String> images) {
        return ProductDetailsResponse.builder()
                .uniqueId(product.getUniqueId())
                .category(product.getCategory())
                .subCategory(product.getSubCategory())
                .productName(product.getProductName())
                .companyName(product.getCompanyName())
                .unit(product.getUnit())
                .value(product.getValue())
                .mrp(product.getMrp())
                .sellerMrp(product.getSellerMrp())
                .purchaseMrp(product.getPurchaseMrp())
                .images(images)
                .build();
    }
}