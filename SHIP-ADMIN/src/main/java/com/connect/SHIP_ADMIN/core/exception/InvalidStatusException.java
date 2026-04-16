package com.connect.SHIP_ADMIN.core.exception;

/**
 * Exception thrown when an invalid status is provided for a user account update.
 * Allowed statuses typically include ACTIVE, LOCKED, EXPIRED, BLOCKED.
 */
public class InvalidStatusException extends RuntimeException {
    public InvalidStatusException(String message) {
        super(message);
    }

    public InvalidStatusException() {
        super("Invalid status. Allowed: ACTIVE, LOCKED, EXPIRED, BLOCKED.");
    }
}
