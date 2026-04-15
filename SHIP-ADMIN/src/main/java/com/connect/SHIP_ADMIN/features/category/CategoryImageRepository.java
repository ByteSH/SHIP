package com.connect.SHIP_ADMIN.features.category;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryImageRepository extends JpaRepository<CategoryImage, Long> {

    Optional<CategoryImage> findByCategory(String category);
    boolean existsByCategory(String category);
    void deleteByCategory(String category);

}