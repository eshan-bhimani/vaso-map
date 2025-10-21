package com.vasomap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for error responses.
 *
 * Educational note: Consistent error responses improve API usability.
 * This DTO follows RFC 7807 (Problem Details for HTTP APIs) principles.
 * All API errors return this standardized format for easier client-side handling.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

	/**
	 * Timestamp when the error occurred
	 */
	private LocalDateTime timestamp;

	/**
	 * HTTP status code (e.g., 404, 500)
	 */
	private Integer status;

	/**
	 * Brief error type (e.g., "Not Found", "Internal Server Error")
	 */
	private String error;

	/**
	 * Detailed error message explaining what went wrong
	 */
	private String message;

	/**
	 * The API path that was requested
	 */
	private String path;
}
