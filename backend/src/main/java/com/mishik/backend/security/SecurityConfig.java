package com.mishik.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // JWT → CSRF не потрібен
                .csrf(csrf -> csrf.disable())

                // Stateless API
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // AUTH PUBLIC
                        .requestMatchers("/api/auth/**").permitAll()

                        // PUBLIC READ API
                        .requestMatchers(HttpMethod.GET,
                                "/api/animals/**",
                                "/api/clinics/**",
                                "/api/shelters/**",
                                "/api/volunteering/**",
                                "/api/volunteering",
                                "/api/animal-types/**",
                                "/api/animal-types"
                                ).permitAll()

                        // AUTHENTICATED USER ACTIONS
                        .requestMatchers("/api/users/me").authenticated()

                        // USER ACTIONS
                        .requestMatchers(HttpMethod.POST,
                                "/api/adoption-requests/**",
                                "/api/volunteering/**",
                                "/api/volunteering"
                        ).authenticated()

                        .requestMatchers(HttpMethod.PUT,
                                "/api/users/me"
                        ).authenticated()

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/adoption-requests/**"
                        ).authenticated()

                        // 🔒 EVERYTHING ELSE
                        .anyRequest().authenticated()
                )

                // JWT filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}