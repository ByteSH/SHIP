package com.connect.SHIP_ADMIN.controller;

import com.connect.SHIP_ADMIN.dto.AuthRequest;
import com.connect.SHIP_ADMIN.dto.AuthResponse;
import com.connect.SHIP_ADMIN.dto.OtpVerifyRequest;
import com.connect.SHIP_ADMIN.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;


    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody AuthRequest request) {
        authService.requestOtp(request);
        return ResponseEntity.ok("OTP sent to registered email.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyOtpAndLogin(request);
        return ResponseEntity.ok(response);
    }
}