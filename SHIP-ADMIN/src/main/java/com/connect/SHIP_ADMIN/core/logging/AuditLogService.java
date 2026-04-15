package com.connect.SHIP_ADMIN.core.logging;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(String username, String action, String status,
                    String ipAddress, String details) {
        AuditLogEntity log = AuditLogEntity.builder()
                .username(username)
                .action(action)
                .status(status)
                .ipAddress(ipAddress)
                .details(details)
                .build();
        auditLogRepository.save(log);
    }
}