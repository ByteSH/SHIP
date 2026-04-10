package com.connect.SHIP_ADMIN.repository;

import com.connect.SHIP_ADMIN.entity.ProductImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImageEntity, Long> {
    List<ProductImageEntity> findByUniqueId(String uniqueId);
}