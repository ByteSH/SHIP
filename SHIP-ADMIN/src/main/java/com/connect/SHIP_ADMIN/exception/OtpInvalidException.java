package com.connect.SHIP_ADMIN.exception;

public class OtpInvalidException extends RuntimeException {
    public OtpInvalidException() {
        super("Invalid OTP. Please try again.");
    }
}