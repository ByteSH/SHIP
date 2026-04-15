package com.connect.SHIP_ADMIN.features.product.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {
    private String uniqueId;
    private String category;
    private String subCategory;
    private String productName;
    private String companyName;
    private String valueUnit;
    private Integer mrp;
    private Integer sellerMrp;
    private Integer purchaseMrp;
    private List<String> imageUrls;
}