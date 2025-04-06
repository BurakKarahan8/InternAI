package com.burakkarahan.InternAI.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        //"http://localhost:5173", // Vite frontend
                        // "http://192.168.196.159:8080" // Aynı frontend başka cihazdan erişim
                        //"http://localhost:8080"  // (İsteğe bağlı) backend'e tarayıcıdan erişim
                        "*"

                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}
