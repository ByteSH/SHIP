package com.connect.SHIP_ADMIN.features.auth;

import com.connect.SHIP_ADMIN.features.otp.OtpVerifyRequest;
import com.connect.SHIP_ADMIN.features.auth.dto.AuthRequest;
import com.connect.SHIP_ADMIN.features.auth.dto.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;


    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        authService.requestOtp(request, getClientIp(httpRequest));
        return ResponseEntity.ok("OTP sent to registered email.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody OtpVerifyRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.verifyOtpAndLogin(request, getClientIp(httpRequest));
        return ResponseEntity.ok(response);
    }


    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}