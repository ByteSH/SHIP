package com.connect.SHIP_ADMIN.features.category;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String category;

    @Column(name = "image_path", nullable = false)
    private String imagePath;
}