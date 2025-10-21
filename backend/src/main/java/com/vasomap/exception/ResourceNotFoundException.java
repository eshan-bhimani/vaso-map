package com.vasomap.exception;

/**
 * Exception thrown when a requested resource is not found in the database.
 *
 * Educational note: Custom exceptions provide better error handling and
 * allow us to return appropriate HTTP status codes (404 for not found).
 * This is preferred over returning null values or generic exceptions.
 */
public class ResourceNotFoundException extends RuntimeException {

	/**
	 * Creates a new ResourceNotFoundException with a custom message.
	 *
	 * @param message Description of what resource was not found
	 */
	public ResourceNotFoundException(String message) {
		super(message);
	}

	/**
	 * Creates a new ResourceNotFoundException with a message and cause.
	 *
	 * @param message Description of what resource was not found
	 * @param cause The underlying exception that caused this
	 */
	public ResourceNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}
}
