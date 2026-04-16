package com.connect.SHIP_ADMIN.features.auth;

import com.connect.SHIP_ADMIN.features.otp.OtpVerifyRequest;
import com.connect.SHIP_ADMIN.core.exception.InvalidCredentialsException;
import com.connect.SHIP_ADMIN.core.exception.OtpExpiredException;
import com.connect.SHIP_ADMIN.core.exception.OtpInvalidException;
import com.connect.SHIP_ADMIN.core.exception.OtpMaxAttemptsException;
import com.connect.SHIP_ADMIN.features.auth.dto.AuthRequest;
import com.connect.SHIP_ADMIN.features.auth.dto.AuthResponse;
import com.connect.SHIP_ADMIN.core.security.JwtUtils;
import com.connect.SHIP_ADMIN.core.logging.AuditLogService;
import com.connect.SHIP_ADMIN.features.otp.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for handling login authentication and OTP issuance.
 */
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
    private final AuditLogService auditLogService;

    /**
     * Validates credentials and initiates the OTP sending process.
     */
    public void requestOtp(AuthRequest request, String ipAddress) {
        try {
            validateCredentials(request.getUsername(), request.getPassword());
            otpService.generateAndSendOtp(request.getUsername(), adminEmail);
            auditLogService.log(request.getUsername(), "REQUEST_OTP",
                    "SUCCESS", ipAddress, "OTP sent successfully.");
        } catch (InvalidCredentialsException e) {
            auditLogService.log(request.getUsername(), "REQUEST_OTP",
                    "FAILED_CREDENTIALS", ipAddress, "Invalid username or password.");
            throw e;
        }
    }

    /**
     * Verifies both the user credentials and the provided OTP.
     * Returns a JWT token upon successful authentication.
     */
    @Transactional
    public AuthResponse verifyOtpAndLogin(OtpVerifyRequest request, String ipAddress) {
        try {
            validateCredentials(request.getUsername(), request.getPassword());
        } catch (InvalidCredentialsException e) {
            auditLogService.log(request.getUsername(), "LOGIN",
                    "FAILED_CREDENTIALS", ipAddress, "Invalid username or password.");
            throw e;
        }

        try {
            otpService.validateOtp(request.getUsername(), request.getOtp());
        } catch (OtpExpiredException e) {
            auditLogService.log(request.getUsername(), "LOGIN",
                    "FAILED_OTP_EXPIRED", ipAddress, "OTP expired.");
            throw e;
        } catch (OtpMaxAttemptsException e) {
            auditLogService.log(request.getUsername(), "LOGIN",
                    "FAILED_MAX_ATTEMPTS", ipAddress, "Max OTP attempts exceeded.");
            throw e;
        } catch (OtpInvalidException e) {
            auditLogService.log(request.getUsername(), "LOGIN",
                    "FAILED_OTP_INVALID", ipAddress, "Invalid OTP entered.");
            throw e;
        }

        String token = jwtUtils.generateToken(request.getUsername());
        auditLogService.log(request.getUsername(), "LOGIN",
                "SUCCESS", ipAddress, "Login successful.");
        return new AuthResponse(token, request.getUsername());
    }

    /**
     * Checks if the username and password match the configured admin credentials.
     */
    private void validateCredentials(String username, String password) {
        if (!adminUsername.equals(username) || !adminPassword.equals(password)) {
            throw new InvalidCredentialsException();
        }
    }
}