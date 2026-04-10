package com.connect.SHIP_ADMIN.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String uniqueId;

    @Column(nullable = false)
    private String category;

    private String subCategory;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "company_name")
    private String companyName;

    private String unit;
    private Integer value;
    private Integer mrp;
    private Integer sellerMrp;

    @Column(name = "purchase_mrp")
    private Integer purchaseMrp;
}