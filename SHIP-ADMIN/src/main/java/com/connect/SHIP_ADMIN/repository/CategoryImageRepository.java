package com.connect.SHIP_ADMIN.repository;

import com.connect.SHIP_ADMIN.entity.CategoryImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryImageRepository extends JpaRepository<CategoryImageEntity, Long> {

    Optional<CategoryImageEntity> findByCategory(String category);
    boolean existsByCategory(String category);
    void deleteByCategory(String category);

}