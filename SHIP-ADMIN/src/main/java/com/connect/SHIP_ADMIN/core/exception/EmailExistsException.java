package com.connect.SHIP_ADMIN.core.exception;

/**
 * Exception thrown when a user tries to register or update an account
 * with an email address that is already registered in the system.
 */
public class EmailExistsException extends RuntimeException {
    public EmailExistsException(String message) {
        super(message);
    }

    public EmailExistsException() {
        super("Email already registered.");
    }
}
