package com.connect.SHIP_ADMIN.core.exception;

/**
 * Exception thrown when an invalid OTP code is entered during verification.
 */
public class OtpInvalidException extends RuntimeException {
    public OtpInvalidException() {
        super("Invalid OTP. Please try again.");
    }
}