package com.connect.SHIP_ADMIN.features.auth;

import com.connect.SHIP_ADMIN.features.otp.OtpVerifyRequest;
import com.connect.SHIP_ADMIN.features.auth.dto.AuthRequest;
import com.connect.SHIP_ADMIN.features.auth.dto.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for administering authentication and authorization.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;


    /**
     * Endpoint for initiating the login flow by requesting an OTP.
     */
    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        authService.requestOtp(request, getClientIp(httpRequest));
        return ResponseEntity.ok("OTP sent to registered email.");
    }

    /**
     * Endpoint for verifying the OTP and issuing a JWT token.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody OtpVerifyRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.verifyOtpAndLogin(request, getClientIp(httpRequest));
        return ResponseEntity.ok(response);
    }


    /**
     * Utility method to extract the client IP address from the request.
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}