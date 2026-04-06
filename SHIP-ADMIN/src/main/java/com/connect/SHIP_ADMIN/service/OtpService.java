package com.connect.SHIP_ADMIN.service;

import com.connect.SHIP_ADMIN.entity.OtpEntity;
import com.connect.SHIP_ADMIN.exception.OtpExpiredException;
import com.connect.SHIP_ADMIN.exception.OtpInvalidException;
import com.connect.SHIP_ADMIN.exception.OtpMaxAttemptsException;
import com.connect.SHIP_ADMIN.repository.OtpRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;

    @Value("${app.otp.expiry-minutes}")
    private int otpExpiryMinutes;


    @Transactional
    public void generateAndSendOtp(String username, String email) {
        otpRepository.deleteByUsername(username);

        String otp = generateOtp();

        OtpEntity otpEntity = OtpEntity.builder()
                .username(username)
                .otp(otp)
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

        if (!otpEntity.getOtp().equals(otp)) {
            otpEntity.setAttempts(otpEntity.getAttempts() + 1);
            otpRepository.save(otpEntity);
            throw new OtpInvalidException();
        }

        otpRepository.deleteByUsername(username);
    }


    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}