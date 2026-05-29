package com.mishik.backend.service;

import com.mishik.backend.dao.AccountRepository;
import com.mishik.backend.dto.LoginRequest;
import com.mishik.backend.entity.Account;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
@Service
public class AuthService {

    private final AccountRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AccountRepository userRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, String> login(LoginRequest request) {
        Account user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Невірний пароль");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole());

        // Повертаємо токен + роль фронтенду
        return Map.of(
                "token", token,
                "role", user.getRole()
        );
    }
}