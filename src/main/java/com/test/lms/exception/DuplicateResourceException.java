package com.test.lms.exception;

/**
 * Thrown when trying to create a resource that already exists (e.g. duplicate course title).
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
