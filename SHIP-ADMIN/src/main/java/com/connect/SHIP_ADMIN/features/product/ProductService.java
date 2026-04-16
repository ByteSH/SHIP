package com.connect.SHIP_ADMIN.features.product;

import com.connect.SHIP_ADMIN.features.product.dto.ProductRequest;
import com.connect.SHIP_ADMIN.features.product.dto.ProductResponse;
import com.connect.SHIP_ADMIN.features.product.model.Product;
import com.connect.SHIP_ADMIN.features.product.model.ProductImage;
import com.connect.SHIP_ADMIN.features.product.repository.ProductImageRepository;
import com.connect.SHIP_ADMIN.features.product.repository.ProductRepository;
import com.connect.SHIP_ADMIN.infrastructure.storage.SupabaseStorageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for managing products and their associated images.
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final SupabaseStorageService storageService;

    /**
     * Retrieves all products for a specific category along with their associated images.
     */
    public List<ProductResponse> getAllProductsService(String category) {
        List<Product> products = productRepository.findByCategory(category);

        return products.stream().map(product -> {
            List<String> images = productImageRepository.findByUniqueId(product.getUniqueId())
                    .stream()
                    .map(ProductImage::getImagePath)
                    .collect(Collectors.toList());

            return mapToResponse(product, images);
        }).collect(Collectors.toList());
    }

    /**
     * Generates a precise, unique identifier for a product based on its primary attributes.
     */
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

    /**
     * Cleans up string inputs for uniform ID generation and formatting.
     */
    private String cleanString(String input) {
        if (input == null) return "";
        return input.trim()
                .replaceAll("[^a-zA-Z0-9 ]", "")
                .replaceAll("\\s+", "_");
    }

    /**
     * Adds a new product and uploads the provided image files to the storage backend.
     */
    @Transactional
    public ProductResponse addProduct(ProductRequest dto, MultipartFile[] images) throws IOException {

        String generatedId = generateUniqueId(dto.getCompanyName(),
                dto.getProductName(),
                dto.getValueUnit(),
                dto.getMrp());


        Product product = Product.builder()
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


        Product savedProduct = productRepository.save(product);
        List<String> uploadedUrls = new ArrayList<>();


        for (int i = 0; i < images.length; i++) {
            String url = storageService.uploadFile(images[i], "products");
            uploadedUrls.add(url);

            ProductImage imageEntity = ProductImage.builder()
                    .uniqueId(savedProduct.getUniqueId())
                    .category(savedProduct.getCategory())
                    .imagePath(url)
                    .isPrimary(i == 0)
                    .build();

            productImageRepository.save(imageEntity);
        }

        return mapToResponse(savedProduct, uploadedUrls);
    }



    /**
     * Adds a new product using predefined image URLs instead of processing direct file uploads.
     */
    @Transactional
    public ProductResponse addProductWithUrls(ProductRequest dto) {

        String generatedId = generateUniqueId(dto.getCompanyName(),
                dto.getProductName(),
                dto.getValueUnit(),
                dto.getMrp());

        Product product = Product.builder()
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

        Product savedProduct = productRepository.save(product);

        for (int i = 0; i < dto.getImageUrls().size(); i++) {
            ProductImage imageEntity = ProductImage.builder()
                    .uniqueId(savedProduct.getUniqueId())
                    .category(savedProduct.getCategory())
                    .imagePath(dto.getImageUrls().get(i))
                    .isPrimary(i == 0)
                    .build();
            productImageRepository.save(imageEntity);
        }

        return mapToResponse(savedProduct, dto.getImageUrls());
    }

    /**
     * Helper mapping method to convert a Product entity and image links into a standard ProductResponse.
     */
    private ProductResponse mapToResponse(Product product, List<String> images) {
        return ProductResponse.builder()
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


    /**
     * Deletes a product entirely, including physically removing its images from the storage provider.
     */
    @Transactional
    public void deleteProductByUniqueId(String uniqueId) {
        List<ProductImage> images = productImageRepository.findByUniqueId(uniqueId);

        for (ProductImage image : images) {
            try {
                storageService.deleteFile(image.getImagePath());
            } catch (Exception e) {
                System.out.println("Error deleting from Supabase: " + e.getMessage());
            }
        }
        productImageRepository.deleteByUniqueId(uniqueId);
        productRepository.deleteByUniqueId(uniqueId);
    }


    /**
     * Updates an existing product using external image URLs rather than uploads.
     */
    @Transactional
    public ProductResponse updateProductWithUrls(String uniqueId, ProductRequest dto) {
        Product existingProduct = productRepository.findByUniqueId(uniqueId)
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
                ProductImage imgEntity = ProductImage.builder()
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