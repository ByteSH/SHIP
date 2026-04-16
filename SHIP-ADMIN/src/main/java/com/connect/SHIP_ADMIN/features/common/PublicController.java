package com.connect.SHIP_ADMIN.features.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for open, unauthenticated endpoints.
 */
@RestController
@RequestMapping("/public")
public class PublicController {

    /**
     * Endpoint to check if the application is running and healthy.
     */
    @GetMapping("/health-check")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }
}