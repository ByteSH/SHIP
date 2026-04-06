package com.connect.SHIP_ADMIN.service;

import com.connect.SHIP_ADMIN.dto.AdminUserRequest;
import com.connect.SHIP_ADMIN.dto.AdminUserResponse;
import com.connect.SHIP_ADMIN.dto.AdminUserUpdateRequest;
import com.connect.SHIP_ADMIN.entity.AdminUserEntity;
import com.connect.SHIP_ADMIN.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserResponse createAdminUser(AdminUserRequest request) {

        if (adminUserRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("USERNAME_EXISTS");
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()
                && adminUserRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("EMAIL_EXISTS");
        }

        AdminUserEntity entity = AdminUserEntity.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .passwordExpiry(LocalDateTime.now().plusMonths(1))
                .lastLogin(LocalDateTime.now())
                .build();

        AdminUserEntity saved = adminUserRepository.save(entity);
        return mapToResponse(saved);
    }

    public AdminUserResponse updateAdminUser(String username, AdminUserUpdateRequest request) {

        AdminUserEntity entity = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        // Email update
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!request.getEmail().equals(entity.getEmail())
                    && adminUserRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("EMAIL_EXISTS");
            }
            entity.setEmail(request.getEmail());
        }

        // Phone update
        if (request.getPhoneNumber() != null) {
            entity.setPhoneNumber(request.getPhoneNumber());
        }

        // Role update
        if (request.getRole() != null && !request.getRole().isBlank()) {
            entity.setRole(request.getRole());
        }

        // PasswordExpiry update
        if (request.getPasswordExpiry() != null) {
            entity.setPasswordExpiry(request.getPasswordExpiry());
        }

// Status logic
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            String newStatus = request.getStatus().toUpperCase();
            String currentStatus = entity.getStatus().toUpperCase();

            switch (newStatus) {

                case "ACTIVE" -> {
                    // LOCKED → ACTIVE
                    if ("LOCKED".equals(currentStatus)) {
                        if (entity.getPasswordExpiry() != null
                                && entity.getPasswordExpiry().isBefore(LocalDateTime.now())) {
                            entity.setStatus("EXPIRED");
                        } else {
                            entity.setStatus("ACTIVE");
                        }
                        entity.setLockTime(null);
                        entity.setFailedAttempts(0);
                    }
                    // EXPIRED → ACTIVE
                    else if ("EXPIRED".equals(currentStatus)) {
                        entity.setStatus("ACTIVE");
                        entity.setPasswordExpiry(LocalDateTime.now().plusMonths(1));
                        entity.setFailedAttempts(0);
                        entity.setLockTime(null);
                    }
                    // BLOCKED → ACTIVE ya koi aur → ACTIVE
                    else {
                        entity.setStatus("ACTIVE");
                    }
                }

                case "LOCKED" -> {
                    entity.setStatus("LOCKED");
                    entity.setLockTime(LocalDateTime.now());
                }

                case "EXPIRED" -> {
                    entity.setStatus("EXPIRED");
                    entity.setPasswordExpiry(LocalDateTime.now());
                }

                case "BLOCKED" -> {
                    entity.setStatus("BLOCKED");
                }

                default -> throw new RuntimeException("INVALID_STATUS");
            }
        }

        AdminUserEntity saved = adminUserRepository.save(entity);
        return mapToResponse(saved);
    }

    public AdminUserResponse getAdminUser(String username) {
        AdminUserEntity entity = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));
        return mapToResponse(entity);
    }

    private AdminUserResponse mapToResponse(AdminUserEntity e) {
        return AdminUserResponse.builder()
                .username(e.getUsername())
                .email(e.getEmail())
                .phoneNumber(e.getPhoneNumber())
                .role(e.getRole())
                .status(e.getStatus())
                .passwordExpiry(e.getPasswordExpiry())
                .failedAttempts(e.getFailedAttempts())
                .lockTime(e.getLockTime())
                .lastLogin(e.getLastLogin())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}