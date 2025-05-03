package com.library_web.library.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of(
            "message", ex.getMessage()
        ));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<?> handleNotFound(NoSuchElementException ex) {
        return ResponseEntity.status(404).body(Map.of(
            "message", ex.getMessage()
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleServerError(Exception ex) {
        return ResponseEntity.internalServerError().body(Map.of(
            "message", "Lỗi hệ thống",
            "details", ex.getMessage()
        ));
    }
}
