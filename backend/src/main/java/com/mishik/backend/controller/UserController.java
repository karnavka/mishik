package com.mishik.backend.controller;

import com.mishik.backend.repository.AccountRepository;
import com.mishik.backend.entity.Account;
import com.mishik.backend.entity.User;
import com.mishik.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public UserController(UserRepository userRepository, AccountRepository accountRepository) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    //взяти інфу про себе
    @GetMapping("/api/me")
    public Map<String, Object> getMe(Authentication authentication) {

        String login = authentication.getName();

        Account account = accountRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> res = new HashMap<>();
        res.put("id", user.getId());
        res.put("firstName", user.getFirstName());
        res.put("lastName", user.getLastName());
        res.put("patronymic", user.getPatronymic());
        res.put("sex", user.getSex());
        res.put("donatedAmount", user.getDonatedAmount());
        res.put("login", account.getLogin());

        return res;
    }

    //редагувати інфу про себе
    @PutMapping("/me")
    public Map<String, Object> updateMe(
            Authentication authentication,
            @RequestBody Map<String, Object> req
    ) {
        String login = authentication.getName();

        Account account = accountRepository.findByLogin(login)
                .orElseThrow();

        User user = userRepository.findByAccount(account)
                .orElseThrow();

        user.setFirstName((String) req.get("firstName"));
        user.setLastName((String) req.get("lastName"));
        user.setPatronymic((String) req.get("patronymic"));

        userRepository.save(user);

        return Map.of("status", "updated");
    }
}
