package com.connect.SHIP_ADMIN.core.exception;

/**
 * Exception thrown when a requested user cannot be found in the database.
 */
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException() {
        super("User not found.");
    }
}
