package com.connect.SHIP_ADMIN.core.exception;

/**
 * Exception thrown when the user attempts to verify an OTP that has already expired.
 */
public class OtpExpiredException extends RuntimeException{
    public OtpExpiredException(){
        super("OTP has expired. Please request a new one.");
    }
}