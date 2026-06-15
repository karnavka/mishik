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
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {

        http
                .cors(cors -> {
                })
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
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/volunteering/me")
                        .hasAnyRole("USER", "SHELTER")

                        // ========================
                        // PUBLIC READ ONLY
                        // ========================
                        .requestMatchers(HttpMethod.GET,
                                "/api/animals",
                                "/api/animals/**",
                                "/api/shelters",
                                "/api/shelters/**",
                                "/api/clinics",
                                "/api/clinics/**",
                                "/api/animal-types",
                                "/api/animal-types/**",
                                "/api/volunteering",
                                "/images/**"
                        ).permitAll()

                        // ========================
                        // USER ONLY ACTIONS
                        // ========================
                        .requestMatchers(HttpMethod.POST,
                                "/api/adoption-requests/**",
                                "/api/donations/**"
                        ).hasRole("USER")

                        .requestMatchers(HttpMethod.POST, "/api/volunteering/**")
                        .hasAnyRole("USER", "SHELTER")

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/adoption-requests/**",
                                "/api/volunteering/**"
                        ).hasRole("USER")
                        // PATCH статус і GET деталі для притулку
                        .requestMatchers(HttpMethod.GET,
                                "/api/adoption-requests/shelter",
                                "/api/adoption-requests/*/contact"
                        ).hasRole("SHELTER")

                        .requestMatchers(HttpMethod.PATCH,
                                "/api/adoption-requests/**"
                        ).hasRole("SHELTER")
                        .requestMatchers(HttpMethod.GET,
                                "/api/adoption-requests/my",
                                "/api/adoption-requests/my/*"
                        ).hasRole("USER")
                        // GET мої заявки для юзера
                        .requestMatchers(HttpMethod.GET,
                                "/api/adoption-requests/my"
                        ).hasRole("USER")

                        // ========================
                        // USER PROFILE
                        // ========================
                        .requestMatchers("/api/users/me/**").hasAnyRole("USER", "SHELTER")

                        // ========================
                        // SHELTER ONLY
                        // ========================
                        .requestMatchers(HttpMethod.POST, "/api/animal-types").hasRole("SHELTER")
                        .requestMatchers("/api/shelters/me/**").hasRole("SHELTER")
                        .requestMatchers("/api/shelters/me/adoption-requests/**")
                        .hasRole("SHELTER")

                        // ========================
                        // EVERYTHING ELSE
                        // ========================
                        // SecurityConfig — додай перед anyRequest()
                        .requestMatchers(HttpMethod.GET, "/api/adoption-requests/debug").permitAll()
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
