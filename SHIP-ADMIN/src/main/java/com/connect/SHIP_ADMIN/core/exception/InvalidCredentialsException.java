package com.connect.SHIP_ADMIN.core.exception;

/**
 * Exception thrown when a user provides an incorrect username or password during login.
 */
public class InvalidCredentialsException extends RuntimeException{
    public InvalidCredentialsException(){
        super("Invalid username or password.");
    }
}