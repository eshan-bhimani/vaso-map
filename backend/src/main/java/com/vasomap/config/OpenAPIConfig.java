package com.vasomap.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuration for OpenAPI (Swagger) documentation.
 *
 * Educational note: OpenAPI/Swagger provides interactive API documentation.
 * It automatically generates a web UI where developers can:
 * 1. See all available endpoints
 * 2. View request/response schemas
 * 3. Test endpoints directly from the browser
 *
 * Access the Swagger UI at: http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenAPIConfig {

	/**
	 * Creates the OpenAPI specification bean.
	 *
	 * This configures the API documentation metadata and server information.
	 *
	 * @return OpenAPI configuration
	 */
	@Bean
	public OpenAPI vasoMapOpenAPI() {
		return new OpenAPI()
			.info(new Info()
				.title("VasoMap API")
				.description("""
					REST API for VasoMap - A Google Maps-style explorer for the human vascular system.

					This API provides endpoints for:
					- Querying blood vessels and their properties
					- Finding paths through the vascular network
					- Exploring anatomical regions

					The MVP focuses on coronary arteries with plans to expand to the full vascular system.
					""")
				.version("1.0.0")
				.contact(new Contact()
					.name("VasoMap Team")
					.email("support@vasomap.com")
					.url("https://vasomap.com"))
				.license(new License()
					.name("MIT License")
					.url("https://opensource.org/licenses/MIT")))
			.servers(List.of(
				new Server()
					.url("http://localhost:8080")
					.description("Local development server")
			));
	}
}
