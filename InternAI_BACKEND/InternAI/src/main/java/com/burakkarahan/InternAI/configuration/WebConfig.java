package com.burakkarahan.InternAI.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Tüm endpoint'lere izin verir
                .allowedOrigins("http://localhost:5173/", "http://192.168.1.150:8080") // Frontend URL'sini burada belirtin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // İzin verilen HTTP metodları
                .allowedHeaders("*") // Tüm header'lara izin ver
                .allowCredentials(true); // Cookie ile çalışıyorsanız true yapabilirsiniz
    }
}
