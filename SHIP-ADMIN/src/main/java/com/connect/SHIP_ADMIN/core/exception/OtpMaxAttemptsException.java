package com.connect.SHIP_ADMIN.core.exception;

/**
 * Exception thrown when a user exceeds the maximum allowed attempts for OTP verification.
 */
public class OtpMaxAttemptsException extends RuntimeException {
    public OtpMaxAttemptsException() {
        super("Maximum OTP attempts exceeded. Please request a new OTP.");
    }
}