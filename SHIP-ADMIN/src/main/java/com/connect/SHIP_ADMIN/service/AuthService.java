package com.connect.SHIP_ADMIN.service;

import com.connect.SHIP_ADMIN.dto.AuthRequest;
import com.connect.SHIP_ADMIN.dto.AuthResponse;
import com.connect.SHIP_ADMIN.dto.OtpVerifyRequest;
import com.connect.SHIP_ADMIN.exception.InvalidCredentialsException;
import com.connect.SHIP_ADMIN.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Value("${app.security.admin.usernames}")
    private String adminUsername;

    @Value("${app.security.admin.passwords}")
    private String adminPassword;

    @Value("${ADMIN_EMAIL}")
    private String adminEmail;

    private final JwtUtils jwtUtils;
    private final OtpService otpService;

    public void requestOtp(AuthRequest request) {
        validateCredentials(request.getUsername(), request.getPassword());
        otpService.generateAndSendOtp(request.getUsername(), adminEmail);
    }

    @Transactional
    public AuthResponse verifyOtpAndLogin(OtpVerifyRequest request) {
        validateCredentials(request.getUsername(), request.getPassword());
        otpService.validateOtp(request.getUsername(), request.getOtp());
        String token = jwtUtils.generateToken(request.getUsername());
        return new AuthResponse(token, request.getUsername());
    }

    private void validateCredentials(String username, String password) {
        if (!adminUsername.equals(username) || !adminPassword.equals(password)) {
            throw new InvalidCredentialsException();
        }
    }
}