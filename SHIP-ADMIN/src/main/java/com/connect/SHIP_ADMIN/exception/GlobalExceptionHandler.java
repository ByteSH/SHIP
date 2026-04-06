package com.connect.SHIP_ADMIN.exception;

import com.connect.SHIP_ADMIN.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return build(HttpStatus.BAD_REQUEST, "Validation Failed", message);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex) {
        return switch (ex.getMessage()) {
            case "USERNAME_EXISTS" ->
                    build(HttpStatus.CONFLICT, "Conflict", "Username already exists.");
            case "EMAIL_EXISTS" ->
                    build(HttpStatus.CONFLICT, "Conflict", "Email already registered.");
            case "USER_NOT_FOUND" ->
                    build(HttpStatus.NOT_FOUND, "Not Found", "User not found.");
            case "INVALID_STATUS" ->
                    build(HttpStatus.BAD_REQUEST, "Bad Request",
                            "Invalid status. Allowed: ACTIVE, LOCKED, EXPIRED, BLOCKED.");
            default ->
                    build(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "Something went wrong.");
        };
    }
}