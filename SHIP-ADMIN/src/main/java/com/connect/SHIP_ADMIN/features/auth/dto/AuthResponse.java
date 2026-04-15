package com.connect.SHIP_ADMIN.features.auth.dto;

import lombok.*;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
}