package com.connect.SHIP_ADMIN.features.product.dto;

import lombok.*;
import java.util.List;

@Data @Builder
public class ProductResponse {
    private String uniqueId;
    private String productName;
    private String companyName;
    private String category;
    private String subCategory;
    private String valueUnit;
    private Integer mrp;
    private Integer sellerMrp;
    private Integer purchaseMrp;
    private List<String> images;
}