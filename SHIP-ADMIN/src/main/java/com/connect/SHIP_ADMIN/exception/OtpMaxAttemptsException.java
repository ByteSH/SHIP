package com.connect.SHIP_ADMIN.exception;

public class OtpMaxAttemptsException extends RuntimeException {
    public OtpMaxAttemptsException() {
        super("Maximum OTP attempts exceeded. Please request a new OTP.");
    }
}