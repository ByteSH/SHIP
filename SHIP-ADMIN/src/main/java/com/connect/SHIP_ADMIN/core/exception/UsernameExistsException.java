package com.connect.SHIP_ADMIN.core.exception;

/**
 * Exception thrown when a user tries to register or update an account 
 * with a username that already exists in the system.
 */
public class UsernameExistsException extends RuntimeException {
    public UsernameExistsException(String message) {
        super(message);
    }

    public UsernameExistsException() {
        super("Username already exists.");
    }
}
