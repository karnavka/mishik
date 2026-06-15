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
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/adoption-requests/adopted-animal-ids").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/volunteering/me")
                        .hasAnyRole("USER", "SHELTER")


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

                        .requestMatchers(HttpMethod.GET,
                                "/api/adoption-requests/my"
                        ).hasRole("USER")

                        .requestMatchers("/api/users/me/**").hasAnyRole("USER", "SHELTER")

                        .requestMatchers(HttpMethod.POST, "/api/animal-types").hasRole("SHELTER")
                        .requestMatchers("/api/shelters/me/**").hasRole("SHELTER")
                        .requestMatchers("/api/shelters/me/adoption-requests/**")
                        .hasRole("SHELTER")

                        .requestMatchers("/api/favorites/**").hasRole("USER")

                        .requestMatchers(HttpMethod.GET, "/api/adoption-requests/debug").permitAll()
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
