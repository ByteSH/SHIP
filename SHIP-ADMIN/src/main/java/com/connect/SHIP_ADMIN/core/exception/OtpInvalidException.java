package com.connect.SHIP_ADMIN.core.exception;

public class OtpInvalidException extends RuntimeException {
    public OtpInvalidException() {
        super("Invalid OTP. Please try again.");
    }
}