package com.connect.SHIP_ADMIN.repository;

import com.connect.SHIP_ADMIN.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    List<ProductEntity> findByCategory(String category);

    Optional<ProductEntity> findByUniqueId(String uniqueId);

    void deleteByUniqueId(String uniqueId);
}