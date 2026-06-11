package com.mishik.backend.controller;
import com.mishik.backend.dto.LoginRequest;
import com.mishik.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (Exception e) {
            e.printStackTrace();
// return ResponseEntity.status(401).body(e.getMessage());
            return ResponseEntity.status(500).body(e.getMessage());
        }


    }
}