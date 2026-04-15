package com.connect.SHIP_ADMIN.features.product.repository;

import com.connect.SHIP_ADMIN.features.product.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByUniqueId(String uniqueId);

    void deleteByUniqueId(String uniqueId);
}