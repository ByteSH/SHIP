package com.connect.SHIP_ADMIN.dto;

import lombok.*;
import java.util.List;

@Data @Builder
public class ProductDetailsResponse {
    private String uniqueId;
    private String productName;
    private String companyName;
    private String category;
    private String subCategory;
    private String unit;
    private Integer value;
    private Integer mrp;
    private Integer sellerMrp;
    private Integer purchaseMrp;
    private List<String> images;
}