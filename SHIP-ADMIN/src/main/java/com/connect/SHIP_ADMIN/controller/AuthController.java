package com.connect.SHIP_ADMIN.controller;

import com.connect.SHIP_ADMIN.dto.AuthRequest;
import com.connect.SHIP_ADMIN.dto.AuthResponse;
import com.connect.SHIP_ADMIN.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.security.admin.usernames}")
    private String adminUsername;

    @Value("${app.security.admin.passwords}")
    private String adminPassword;


    private final JwtUtils jwtUtils;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        if (adminUsername.equals(request.getUsername())
                && adminPassword.equals(request.getPassword())) {
            String token = jwtUtils.generateToken(request.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, request.getUsername()));
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid credentials");
    }
}