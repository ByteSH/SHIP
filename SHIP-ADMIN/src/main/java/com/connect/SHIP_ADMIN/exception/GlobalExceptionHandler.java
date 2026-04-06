package com.connect.SHIP_ADMIN.exception;

import com.connect.SHIP_ADMIN.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex) {
        return build(HttpStatus.UNAUTHORIZED, "Unauthorized", ex.getMessage());
    }

    @ExceptionHandler(OtpExpiredException.class)
    public ResponseEntity<ErrorResponse> handleOtpExpired(OtpExpiredException ex) {
        return build(HttpStatus.GONE, "OTP Expired", ex.getMessage());
    }

    @ExceptionHandler(OtpInvalidException.class)
    public ResponseEntity<ErrorResponse> handleOtpInvalid(OtpInvalidException ex) {
        return build(HttpStatus.UNAUTHORIZED, "Invalid OTP", ex.getMessage());
    }

    @ExceptionHandler(OtpMaxAttemptsException.class)
    public ResponseEntity<ErrorResponse> handleOtpMaxAttempts(OtpMaxAttemptsException ex) {
        return build(HttpStatus.TOO_MANY_REQUESTS, "Too Many Attempts", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "Something went wrong.");
    }

    private ResponseEntity<ErrorResponse> build(HttpStatus status, String error, String message) {
        return ResponseEntity
                .status(status)
                .body(new ErrorResponse(status.value(), error, message, LocalDateTime.now()));
    }
}