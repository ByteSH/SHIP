package com.connect.SHIP_ADMIN.controller;

import com.connect.SHIP_ADMIN.dto.AdminUserRequest;
import com.connect.SHIP_ADMIN.dto.AdminUserResponse;
import com.connect.SHIP_ADMIN.dto.AdminUserUpdateRequest;
import com.connect.SHIP_ADMIN.service.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @PostMapping
    public ResponseEntity<AdminUserResponse> createAdminUser(
            @Valid @RequestBody AdminUserRequest request) {
        AdminUserResponse response = adminUserService.createAdminUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{username}")
    public ResponseEntity<AdminUserResponse> updateAdminUser(
            @PathVariable String username,
            @Valid @RequestBody AdminUserUpdateRequest request) {
        AdminUserResponse response = adminUserService.updateAdminUser(username, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{username}")
    public ResponseEntity<AdminUserResponse> getAdminUser(@PathVariable String username) {
        AdminUserResponse response = adminUserService.getAdminUser(username);
        return ResponseEntity.ok(response);
    }
}