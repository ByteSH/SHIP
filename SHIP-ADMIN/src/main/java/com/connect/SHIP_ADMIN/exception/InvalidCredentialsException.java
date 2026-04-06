package com.connect.SHIP_ADMIN.exception;

public class InvalidCredentialsException extends RuntimeException{
    public InvalidCredentialsException(){
        super("Invalid username or password.");
    }
}