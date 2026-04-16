package com.connect.SHIP_ADMIN.features.otp;

import com.connect.SHIP_ADMIN.core.exception.OtpExpiredException;
import com.connect.SHIP_ADMIN.core.exception.OtpInvalidException;
import com.connect.SHIP_ADMIN.core.exception.OtpMaxAttemptsException;
import com.connect.SHIP_ADMIN.infrastructure.mail.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service class for generating, securely hashing, and validating One Time Passwords (OTPs).
 */
@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.otp.expiry-minutes}")
    private int otpExpiryMinutes;


    /**
     * Generates a new OTP, hashes it, stores it, and sends it via email.
     * Replaces any existing OTP for the user.
     */
    @Transactional
    public void generateAndSendOtp(String username, String email) {
        otpRepository.deleteByUsername(username);
        otpRepository.flush();

        String otp = generateOtp();
        String hashedOtp = passwordEncoder.encode(otp);

        OtpEntity otpEntity = OtpEntity.builder()
                .username(username)
                .otp(hashedOtp)
                .expiryTime(LocalDateTime.now().plusMinutes(otpExpiryMinutes))
                .createdAt(LocalDateTime.now())
                .build();

        otpRepository.save(otpEntity);

        try {
            emailService.sendOtpEmail(email, otp);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email.", e);
        }
    }


    /**
     * Validates a provided OTP against the securely stored hash.
     * Enforces expiry times and limits maximum failed attempts.
     */
    @Transactional
    public void validateOtp(String username, String otp) {
        Optional<OtpEntity> otpEntityOpt = otpRepository.findByUsername(username);

        if (otpEntityOpt.isEmpty()) {
            throw new OtpExpiredException();
        }

        OtpEntity otpEntity = otpEntityOpt.get();

        if (LocalDateTime.now().isAfter(otpEntity.getExpiryTime())) {
            otpRepository.deleteByUsername(username);
            throw new OtpExpiredException();
        }

        if (otpEntity.getAttempts() >= 3) {
            otpRepository.deleteByUsername(username);
            throw new OtpMaxAttemptsException();
        }

        if (!passwordEncoder.matches(otp, otpEntity.getOtp())) {
            otpEntity.setAttempts(otpEntity.getAttempts() + 1);
            otpRepository.save(otpEntity);
            throw new OtpInvalidException();
        }

        otpRepository.deleteByUsername(username);
    }


    /**
     * Generates a random 6-digit number as an OTP string.
     */
    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}