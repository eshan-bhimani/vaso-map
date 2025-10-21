package com.vasomap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the VesselNav Spring Boot application.
 *
 * Educational note: @SpringBootApplication is a convenience annotation that combines:
 * - @Configuration: Marks this as a source of bean definitions
 * - @EnableAutoConfiguration: Tells Spring Boot to auto-configure based on dependencies
 * - @ComponentScan: Scans for components, services, repositories in com.vasomap package
 *
 * Spring Boot's auto-configuration sets up:
 * - Embedded Tomcat server
 * - Database connection pool
 * - JPA/Hibernate
 * - JSON serialization
 * - And much more, all based on classpath and properties
 */
@SpringBootApplication
public class VesselNavApplication {

	/**
	 * Application entry point.
	 *
	 * SpringApplication.run() starts the Spring context and embedded server.
	 * By default, the server runs on port 8080 (configurable in application.yml).
	 *
	 * @param args Command-line arguments
	 */
	public static void main(String[] args) {
		SpringApplication.run(VesselNavApplication.class, args);
	}
}
