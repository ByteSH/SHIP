package com.connect.SHIP_ADMIN.features.admin;

import com.connect.SHIP_ADMIN.core.exception.EmailExistsException;
import com.connect.SHIP_ADMIN.core.exception.InvalidStatusException;
import com.connect.SHIP_ADMIN.core.exception.UserNotFoundException;
import com.connect.SHIP_ADMIN.core.exception.UsernameExistsException;
import com.connect.SHIP_ADMIN.features.admin.dto.AdminUserUpdateRequest;
import com.connect.SHIP_ADMIN.features.admin.dto.AdminUserRequest;
import com.connect.SHIP_ADMIN.features.admin.dto.AdminUserResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service class for managing admin user accounts including creation, 
 * modification, retrieval, and deletion.
 */
@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Creates a new admin user after validating uniqueness of username and email.
     */
    public AdminUserResponse createAdminUser(AdminUserRequest request) {

        if (adminUserRepository.existsByUsername(request.getUsername())) {
            throw new UsernameExistsException();
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()
                && adminUserRepository.existsByEmail(request.getEmail())) {
            throw new EmailExistsException();
        }

        AdminUser entity = AdminUser.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .passwordExpiry(LocalDateTime.now().plusMonths(1))
                .lastLogin(LocalDateTime.now())
                .build();

        AdminUser saved = adminUserRepository.save(entity);
        return mapToResponse(saved);
    }

    /**
     * Updates an existing admin user's details, including status transitions.
     */
    @Transactional
    public AdminUserResponse updateAdminUser(String username, AdminUserUpdateRequest request) {

        AdminUser entity = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException());

        // Email update
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!request.getEmail().equals(entity.getEmail())
                    && adminUserRepository.existsByEmail(request.getEmail())) {
                throw new EmailExistsException();
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

        // Update user status and handle status transition rules
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            String newStatus = request.getStatus().toUpperCase();
            String currentStatus = entity.getStatus().toUpperCase();

            switch (newStatus) {

                case "ACTIVE" -> {
                    // Handle transition from LOCKED to ACTIVE
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
                    // Handle transition from EXPIRED to ACTIVE
                    else if ("EXPIRED".equals(currentStatus)) {
                        entity.setStatus("ACTIVE");
                        entity.setPasswordExpiry(LocalDateTime.now().plusMonths(1));
                        entity.setFailedAttempts(0);
                        entity.setLockTime(null);
                    }
                    // Handle transition from BLOCKED or other statuses to ACTIVE
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

                default -> throw new InvalidStatusException();
            }
        }

        AdminUser saved = adminUserRepository.save(entity);
        return mapToResponse(saved);
    }

    /**
     * Retrieves all admin users.
     */
    public List<AdminUserResponse> getAllAdminUsers() {
        return adminUserRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Retrieves a specific admin user by username.
     */
    public AdminUserResponse getAdminUser(String username) {
        AdminUser entity = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException());
        return mapToResponse(entity);
    }

    private AdminUserResponse mapToResponse(AdminUser e) {
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


    /**
     * Deletes an admin user by username if they exist.
     */
    @Transactional
    public void deleteAdminUser(String username) {
        // Verify user exists before deletion
        if (!adminUserRepository.existsByUsername(username)) {
            throw new UserNotFoundException("Admin user not found with username: " + username);
        }

        // Perform deletion
        adminUserRepository.deleteByUsername(username);
    }
}