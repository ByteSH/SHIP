package com.connect.SHIP_ADMIN.core.exception;

/**
 * Exception thrown when a requested product category cannot be found.
 */
public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(String message) {
        super(message);
    }

    public CategoryNotFoundException() {
        super("Category not found.");
    }
}
