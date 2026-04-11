package com.connect.SHIP_ADMIN.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProductRequestDTO {
    private String uniqueId;
    private String category;
    private String subCategory;
    private String productName;
    private String companyName;
    private String unit;
    private Integer value;
    private Integer mrp;
    private Integer sellerMrp;
    private Integer purchaseMrp;
    private List<String> imageUrls;
}