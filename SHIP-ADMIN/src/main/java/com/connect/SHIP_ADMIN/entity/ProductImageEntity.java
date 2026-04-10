package com.connect.SHIP_ADMIN.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_images")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;

    @Column(name = "image_path")
    private String imagePath;

    @Column(name = "is_primary")
    private boolean isPrimary;

    @Column(name = "unique_id")
    private String uniqueId;
}