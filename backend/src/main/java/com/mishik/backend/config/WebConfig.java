package com.mishik.backend.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = System.getProperty("user.dir") + "/uploads/images/";
        System.out.println(">>> Serving images from: " + uploadPath);
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadPath);
    }
}