package com.connect.SHIP_ADMIN.features.admin;

import com.connect.SHIP_ADMIN.features.admin.dto.AdminUserUpdateRequest;
import com.connect.SHIP_ADMIN.features.admin.dto.AdminUserRequest;
import com.connect.SHIP_ADMIN.features.admin.dto.AdminUserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getAllAdminUsers() {
        return ResponseEntity.ok(adminUserService.getAllAdminUsers());
    }

    @GetMapping("/{username}")
    public ResponseEntity<AdminUserResponse> getAdminUser(@PathVariable String username) {
        AdminUserResponse response = adminUserService.getAdminUser(username);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<String> deleteAdminUser(@PathVariable String username) {
        adminUserService.deleteAdminUser(username);
        return ResponseEntity.ok("Admin user '" + username + "' deleted successfully.");
    }
}