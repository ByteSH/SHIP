package com.connect.SHIP_ADMIN.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, length = 30)
    private String action;  // REQUEST_OTP, LOGIN_SUCCESS, LOGIN_FAILED

    @Column(nullable = false, length = 50)
    private String status;  // SUCCESS, FAILED_CREDENTIALS, FAILED_OTP, FAILED_MAX_ATTEMPTS

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(length = 255)
    private String details;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}