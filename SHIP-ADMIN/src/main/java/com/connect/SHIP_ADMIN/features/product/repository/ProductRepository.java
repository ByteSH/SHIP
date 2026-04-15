package com.connect.SHIP_ADMIN.features.product.repository;

import com.connect.SHIP_ADMIN.features.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);

    Optional<Product> findByUniqueId(String uniqueId);

    void deleteByUniqueId(String uniqueId);
}