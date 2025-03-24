package com.burakkarahan.InternAI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = { "com.burakkarahan" })
@ComponentScan(basePackages = { "com.burakkarahan" })
@EnableJpaRepositories(basePackages = { "com.burakkarahan" })
public class InternAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(InternAiApplication.class, args);
	}

}
