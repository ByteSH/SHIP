package com.connect.SHIP_ADMIN.exception;

public class OtpExpiredException extends RuntimeException{
    public OtpExpiredException(){
        super("OTP has expired. Please request a new one.");
    }
}