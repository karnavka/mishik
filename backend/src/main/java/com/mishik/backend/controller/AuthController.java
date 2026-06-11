package com.mishik.backend.controller;
import com.mishik.backend.dto.LoginRequest;
import com.mishik.backend.entity.Account;
import com.mishik.backend.entity.Shelter;
import com.mishik.backend.entity.User;
import com.mishik.backend.enums.Role;
import com.mishik.backend.enums.Sex;
import com.mishik.backend.repository.AccountRepository;
import com.mishik.backend.repository.ShelterRepository;
import com.mishik.backend.repository.UserRepository;
import com.mishik.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    private final AuthService authService;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final ShelterRepository shelterRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AccountRepository accountRepository,
                          UserRepository userRepository,
                          ShelterRepository shelterRepository,
                          PasswordEncoder passwordEncoder,AuthService authService) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.shelterRepository = shelterRepository;
        this.passwordEncoder = passwordEncoder;
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

        // POST /api/auth/register/user
    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, Object> req) {
        String login = (String) req.get("login");
        String password = (String) req.get("password");
        String firstName = (String) req.get("firstName");
        String lastName = (String) req.get("lastName");
        String patronymic = (String) req.get("patronymic");
        String sexStr = (String) req.get("sex");
        String phoneNumber = (String) req.get("phoneNumber"); // необов'язково

        if (login == null || password == null)
            return ResponseEntity.badRequest().body(Map.of("error", "login and password required"));

        if (accountRepository.findByLogin(login).isPresent())
            return ResponseEntity.badRequest().body(Map.of("error", "login already taken"));

        Account account = Account.builder()
                .login(login)
                .password(passwordEncoder.encode(password))
                .role(Role.ROLE_USER)
                .build();
        accountRepository.save(account);

        User user = new User();
        user.setAccount(account);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPatronymic(patronymic);
        if (sexStr != null) user.setSex(Sex.valueOf(sexStr));
        if (phoneNumber != null && !phoneNumber.isBlank()) {
            user.setPhoneNumber(phoneNumber);
            user.setPhoneVerified(false);
        }
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("status", "registered", "role", "USER"));
    }

    // POST /api/auth/register/shelter
    @PostMapping("/register/shelter")
    public ResponseEntity<?> registerShelter(@RequestBody Map<String, Object> req) {
        String login = (String) req.get("login");
        String password = (String) req.get("password");
        String name = (String) req.get("name");
        String phoneNumber = (String) req.get("phoneNumber"); // необов'язково
        String socialLinks = (String) req.get("socialLinks"); // необов'язково

        if (login == null || password == null)
            return ResponseEntity.badRequest().body(Map.of("error", "login and password required"));

        if (accountRepository.findByLogin(login).isPresent())
            return ResponseEntity.badRequest().body(Map.of("error", "login already taken"));

        Account account = Account.builder()
                .login(login)
                .password(passwordEncoder.encode(password))
                .role(Role.ROLE_SHELTER)
                .build();
        accountRepository.save(account);

        Shelter shelter = new Shelter();
        shelter.setAccount(account);
        shelter.setName(name);
        if (phoneNumber != null && !phoneNumber.isBlank()) {
            shelter.setPhoneNumber(phoneNumber);
            shelter.setPhoneVerified(false);
        }
        if (socialLinks != null && !socialLinks.isBlank()) {
            shelter.setSocialLinks(socialLinks);
        }
        shelterRepository.save(shelter);

        return ResponseEntity.ok(Map.of("status", "registered", "role", "SHELTER"));
    }
}