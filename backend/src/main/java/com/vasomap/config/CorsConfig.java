package com.vasomap.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * Configuration for Cross-Origin Resource Sharing (CORS).
 *
 * Educational note: CORS is a security feature that prevents web pages from
 * making requests to a different domain than the one that served the page.
 *
 * Since our frontend (localhost:5173) and backend (localhost:8080) are on
 * different ports, they're considered different origins. We need to explicitly
 * allow the frontend to make requests to the backend.
 *
 * In production, you would restrict this to your actual frontend domain.
 */
@Configuration
public class CorsConfig {

	/**
	 * Creates a CORS filter bean that allows requests from the frontend.
	 *
	 * This configuration:
	 * 1. Allows requests from localhost:5173 (Vite dev server)
	 * 2. Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
	 * 3. Allows all headers
	 * 4. Allows credentials (cookies, authorization headers)
	 *
	 * @return CorsFilter configured for development
	 */
	@Bean
	public CorsFilter corsFilter() {
		CorsConfiguration config = new CorsConfiguration();

		// Allow frontend origin (Vite dev server)
		config.setAllowedOrigins(List.of("http://localhost:5173"));

		// Allow all HTTP methods
		config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

		// Allow all headers
		config.setAllowedHeaders(List.of("*"));

		// Allow credentials (cookies, authorization headers)
		config.setAllowCredentials(true);

		// Apply this configuration to all endpoints
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);

		return new CorsFilter(source);
	}
}
