package com.connect.SHIP_ADMIN.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class CategoryImageResponse {
    private String category;
    private String imagePath;
}