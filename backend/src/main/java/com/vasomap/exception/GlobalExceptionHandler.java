package com.vasomap.exception;

import com.vasomap.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

/**
 * Global exception handler for the application.
 *
 * Educational note: @RestControllerAdvice allows us to handle exceptions
 * across the entire application in one place. This ensures:
 * 1. Consistent error response format
 * 2. Appropriate HTTP status codes
 * 3. No stack traces leaked to clients
 * 4. Centralized error handling logic
 *
 * Spring automatically calls these handler methods when exceptions occur
 * in any controller.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

	/**
	 * Handles ResourceNotFoundException (e.g., vessel not found).
	 *
	 * Returns HTTP 404 (Not Found) with a descriptive error message.
	 *
	 * @param ex The exception
	 * @param request The HTTP request that caused the error
	 * @return ResponseEntity with 404 status and error details
	 */
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleResourceNotFound(
		ResourceNotFoundException ex,
		HttpServletRequest request
	) {
		ErrorResponse error = new ErrorResponse(
			LocalDateTime.now(),
			HttpStatus.NOT_FOUND.value(),
			HttpStatus.NOT_FOUND.getReasonPhrase(),
			ex.getMessage(),
			request.getRequestURI()
		);

		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}

	/**
	 * Handles validation errors from @Valid annotations on DTOs.
	 *
	 * Educational note: When a request body fails validation (e.g., missing
	 * required field), Spring throws MethodArgumentNotValidException.
	 * We convert all validation errors into a readable message.
	 *
	 * Returns HTTP 400 (Bad Request).
	 *
	 * @param ex The validation exception
	 * @param request The HTTP request
	 * @return ResponseEntity with 400 status and validation errors
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationErrors(
		MethodArgumentNotValidException ex,
		HttpServletRequest request
	) {
		// Collect all validation error messages
		String errorMessage = ex.getBindingResult()
			.getAllErrors()
			.stream()
			.map(error -> {
				if (error instanceof FieldError) {
					FieldError fieldError = (FieldError) error;
					return fieldError.getField() + ": " + fieldError.getDefaultMessage();
				}
				return error.getDefaultMessage();
			})
			.collect(Collectors.joining(", "));

		ErrorResponse error = new ErrorResponse(
			LocalDateTime.now(),
			HttpStatus.BAD_REQUEST.value(),
			HttpStatus.BAD_REQUEST.getReasonPhrase(),
			"Validation failed: " + errorMessage,
			request.getRequestURI()
		);

		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	/**
	 * Handles IllegalArgumentException (e.g., invalid parameters).
	 *
	 * Returns HTTP 400 (Bad Request).
	 *
	 * @param ex The exception
	 * @param request The HTTP request
	 * @return ResponseEntity with 400 status and error details
	 */
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErrorResponse> handleIllegalArgument(
		IllegalArgumentException ex,
		HttpServletRequest request
	) {
		ErrorResponse error = new ErrorResponse(
			LocalDateTime.now(),
			HttpStatus.BAD_REQUEST.value(),
			HttpStatus.BAD_REQUEST.getReasonPhrase(),
			ex.getMessage(),
			request.getRequestURI()
		);

		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	/**
	 * Handles all other unexpected exceptions.
	 *
	 * Educational note: This is a catch-all handler for any exception
	 * not specifically handled above. Returns HTTP 500 (Internal Server Error)
	 * but hides the technical details from the client for security.
	 *
	 * In production, you would log the full exception details for debugging.
	 *
	 * @param ex The exception
	 * @param request The HTTP request
	 * @return ResponseEntity with 500 status and generic error message
	 */
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGenericException(
		Exception ex,
		HttpServletRequest request
	) {
		// Log the full exception for debugging (in production, use proper logging)
		ex.printStackTrace();

		ErrorResponse error = new ErrorResponse(
			LocalDateTime.now(),
			HttpStatus.INTERNAL_SERVER_ERROR.value(),
			HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
			"An unexpected error occurred. Please try again later.",
			request.getRequestURI()
		);

		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
