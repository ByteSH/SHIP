package com.connect.SHIP_ADMIN.dto;

import lombok.*;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
}