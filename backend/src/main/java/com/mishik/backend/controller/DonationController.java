package com.mishik.backend.controller;

import com.mishik.backend.entity.Account;
import com.mishik.backend.entity.Shelter;
import com.mishik.backend.entity.User;
import com.mishik.backend.repository.AccountRepository;
import com.mishik.backend.repository.ShelterRepository;
import com.mishik.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final ShelterRepository shelterRepository;

    public DonationController(
            AccountRepository accountRepository,
            UserRepository userRepository,
            ShelterRepository shelterRepository
    ) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.shelterRepository = shelterRepository;
    }

    @PostMapping
    public Map<String, Object> createDonation(
            Authentication authentication,
            @RequestBody Map<String, Object> req
    ) {
        String login = authentication.getName();

        Account account = accountRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long shelterId = Long.valueOf(req.get("shelterId").toString());
        BigDecimal amount = new BigDecimal(req.get("amount").toString());

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Donation amount must be positive");
        }

        Shelter shelter = shelterRepository.findById(shelterId)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        user.addDonation(amount);
        userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("status", "created");
        res.put("shelterId", shelter.getId());
        res.put("shelterName", shelter.getName());
        res.put("amount", amount);
        res.put("userDonatedAmount", user.getDonatedAmount());

        return res;
    }
}
