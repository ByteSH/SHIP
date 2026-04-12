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
import java.util.Optional;
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

            return mapToResponse(product, images);
        }).collect(Collectors.toList());
    }

    private String generateUniqueId(String companyName, String productName, String valueUnit, Integer mrp) {
        String cleanCompany = cleanString(companyName);
        String cleanProduct = cleanString(productName);
        String cleanUnit = cleanString(valueUnit);

        return String.format("%s_%s_%s_%s",
                        cleanCompany,
                        cleanProduct,
                        cleanUnit,
                        mrp)
                .toUpperCase();
    }

    private String cleanString(String input) {
        if (input == null) return "";
        return input.trim()
                .replaceAll("[^a-zA-Z0-9 ]", "")
                .replaceAll("\\s+", "_");
    }

    @Transactional
    public ProductDetailsResponse addProduct(ProductEntity productData, MultipartFile[] images) throws IOException {

        String generatedId = generateUniqueId(productData.getCompanyName(),
                productData.getProductName(),
                productData.getValueUnit(),
                productData.getMrp());
        productData.setUniqueId(generatedId);

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

        return mapToResponse(savedProduct, uploadedUrls);
    }

    @Transactional
    public ProductDetailsResponse addProductWithUrls(ProductRequestDTO dto) {

        String generatedId = generateUniqueId(dto.getCompanyName(),
                dto.getProductName(),
                dto.getValueUnit(),
                dto.getMrp());

        ProductEntity product = ProductEntity.builder()
                .uniqueId(generatedId)
                .category(dto.getCategory())
                .subCategory(dto.getSubCategory())
                .productName(dto.getProductName())
                .companyName(dto.getCompanyName())
                .valueUnit(dto.getValueUnit())
                .mrp(dto.getMrp())
                .sellerMrp(dto.getSellerMrp())
                .purchaseMrp(dto.getPurchaseMrp())
                .build();

        ProductEntity savedProduct = productRepository.save(product);

        for (int i = 0; i < dto.getImageUrls().size(); i++) {
            ProductImageEntity imageEntity = ProductImageEntity.builder()
                    .uniqueId(savedProduct.getUniqueId())
                    .category(savedProduct.getCategory())
                    .imagePath(dto.getImageUrls().get(i))
                    .isPrimary(i == 0)
                    .build();
            productImageRepository.save(imageEntity);
        }

        return mapToResponse(savedProduct, dto.getImageUrls());
    }

    private ProductDetailsResponse mapToResponse(ProductEntity product, List<String> images) {
        return ProductDetailsResponse.builder()
                .uniqueId(product.getUniqueId())
                .category(product.getCategory())
                .subCategory(product.getSubCategory())
                .productName(product.getProductName())
                .companyName(product.getCompanyName())
                .valueUnit(product.getValueUnit())
                .mrp(product.getMrp())
                .sellerMrp(product.getSellerMrp())
                .purchaseMrp(product.getPurchaseMrp())
                .images(images)
                .build();
    }


    @Transactional
    public void deleteProductByUniqueId(String uniqueId) {
        List<ProductImageEntity> images = productImageRepository.findByUniqueId(uniqueId);

        for (ProductImageEntity image : images) {
            try {
                storageService.deleteFile(image.getImagePath());
            } catch (Exception e) {
                System.out.println("Error deleting from Supabase: " + e.getMessage());
            }
        }
        productImageRepository.deleteByUniqueId(uniqueId);
        productRepository.deleteByUniqueId(uniqueId);
    }


    @Transactional
    public ProductDetailsResponse updateProduct(String uniqueId, ProductEntity updatedData, MultipartFile[] newImages) throws IOException {
        ProductEntity existingProduct = productRepository.findByUniqueId(uniqueId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + uniqueId));

        existingProduct.setProductName(updatedData.getProductName());
        existingProduct.setCompanyName(updatedData.getCompanyName());
        existingProduct.setCategory(updatedData.getCategory());
        existingProduct.setSubCategory(updatedData.getSubCategory());
        existingProduct.setValueUnit(updatedData.getValueUnit());
        existingProduct.setMrp(updatedData.getMrp());
        existingProduct.setSellerMrp(updatedData.getSellerMrp());
        existingProduct.setPurchaseMrp(updatedData.getPurchaseMrp());

        if (newImages != null && newImages.length > 0) {
            deleteOldImages(uniqueId);

            List<String> newUrls = new ArrayList<>();
            for (int i = 0; i < newImages.length; i++) {
                String url = storageService.uploadFile(newImages[i], "products");
                newUrls.add(url);

                ProductImageEntity imgEntity = ProductImageEntity.builder()
                        .uniqueId(uniqueId)
                        .category(existingProduct.getCategory())
                        .imagePath(url)
                        .isPrimary(i == 0)
                        .build();
                productImageRepository.save(imgEntity);
            }
        }

        productRepository.save(existingProduct);

        List<String> currentImages = productImageRepository.findByUniqueId(uniqueId)
                .stream().map(ProductImageEntity::getImagePath).collect(Collectors.toList());

        return mapToResponse(existingProduct, currentImages);
    }

    private void deleteOldImages(String uniqueId) {
        List<ProductImageEntity> oldImages = productImageRepository.findByUniqueId(uniqueId);
        for (ProductImageEntity img : oldImages) {
            storageService.deleteFile(img.getImagePath());
        }
        productImageRepository.deleteByUniqueId(uniqueId);
    }




    @Transactional
    public ProductDetailsResponse updateProductWithUrls(String uniqueId, ProductRequestDTO dto) {
        ProductEntity existingProduct = productRepository.findByUniqueId(uniqueId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + uniqueId));

        existingProduct.setProductName(dto.getProductName());
        existingProduct.setCompanyName(dto.getCompanyName());
        existingProduct.setCategory(dto.getCategory());
        existingProduct.setSubCategory(dto.getSubCategory());
        existingProduct.setValueUnit(dto.getValueUnit());
        existingProduct.setMrp(dto.getMrp());
        existingProduct.setSellerMrp(dto.getSellerMrp());
        existingProduct.setPurchaseMrp(dto.getPurchaseMrp());

        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            productImageRepository.deleteByUniqueId(uniqueId);

            for (int i = 0; i < dto.getImageUrls().size(); i++) {
                ProductImageEntity imgEntity = ProductImageEntity.builder()
                        .uniqueId(uniqueId)
                        .category(existingProduct.getCategory())
                        .imagePath(dto.getImageUrls().get(i))
                        .isPrimary(i == 0)
                        .build();
                productImageRepository.save(imgEntity);
            }
        }

        productRepository.save(existingProduct);

        return mapToResponse(existingProduct, dto.getImageUrls());
    }
}