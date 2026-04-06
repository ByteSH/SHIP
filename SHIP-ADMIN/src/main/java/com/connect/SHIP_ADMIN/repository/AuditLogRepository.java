package com.connect.SHIP_ADMIN.repository;

import com.connect.SHIP_ADMIN.entity.AuditLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogEntity, Long> {
    List<AuditLogEntity> findByUsernameOrderByCreatedAtDesc(String username);
}