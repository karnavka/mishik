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
                .cors(cors -> {})
                // JWT → CSRF не потрібен
                .csrf(csrf -> csrf.disable())

                // Stateless API
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // ========================
                        // PUBLIC AUTH
                        // ========================
                        .requestMatchers("/api/auth/**").permitAll()

                        // ========================
                        // PUBLIC READ ONLY
                        // ========================
                        .requestMatchers(HttpMethod.GET,
                                "/api/animals/**",
                                "/api/shelters/**",
                                "/api/clinics/**",
                                "/api/animal-types/**"
                        ).permitAll()

                        // ========================
                        // USER ONLY ACTIONS
                        // ========================
                        .requestMatchers(HttpMethod.POST,
                                "/api/adoption-requests/**",
                                "/api/volunteering/**"
                        ).hasRole("USER")

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/adoption-requests/**",
                                "/api/volunteering/**"
                        ).hasRole("USER")

                        // ========================
                        // USER PROFILE
                        // ========================
                        .requestMatchers("/api/users/me/**").hasAnyRole("USER", "SHELTER")

                        // ========================
                        // SHELTER ONLY
                        // ========================
                        .requestMatchers("/api/shelters/me/**").hasRole("SHELTER")
                        .requestMatchers("/api/shelters/me/adoption-requests/**")
                        .hasRole("SHELTER")

                        // ========================
                        // EVERYTHING ELSE
                        // ========================
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