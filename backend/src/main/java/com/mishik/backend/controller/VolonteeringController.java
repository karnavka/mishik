package com.mishik.backend.controller;

import com.mishik.backend.entity.Account;
import com.mishik.backend.entity.Shelter;
import com.mishik.backend.entity.User;
import com.mishik.backend.entity.Volonteering;
import com.mishik.backend.enums.Role;
import com.mishik.backend.repository.AccountRepository;
import com.mishik.backend.repository.ShelterRepository;
import com.mishik.backend.repository.UserRepository;
import com.mishik.backend.repository.VolonteeringRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/volunteering")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class VolonteeringController {

    private final VolonteeringRepository repository;
    private final AccountRepository accountRepository;
    private final ShelterRepository shelterRepository;
    private final UserRepository userRepository;

    public VolonteeringController(
            VolonteeringRepository repository,
            AccountRepository accountRepository,
            ShelterRepository shelterRepository,
            UserRepository userRepository
    ) {
        this.repository = repository;
        this.accountRepository = accountRepository;
        this.shelterRepository = shelterRepository;
        this.userRepository = userRepository;
    }

    // -------------------------------
    // приклад : GET /volonteering?city=Kyiv
    // приклад : GET /volonteering?region=Kyivska
    // приклад : GET /volonteering?city=Kyiv&region=Kyivska
    // фільтрація волонтерств по місту та/або регіоні
    @GetMapping
    public List<Map<String, Object>> getVolonteering(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String region
    ) {

        List<Volonteering> list;

        if (city != null && region != null) {
            list = repository.findByAddress_CityAndAddress_Region(city, region);
        } else if (city != null) {
            list = repository.findByAddress_City(city);
        } else if (region != null) {
            list = repository.findByAddress_Region(region);
        } else {
            list = repository.findAll();
        }

        return list.stream()
                .map(this::toMap)
                .toList();
    }

    @GetMapping("/me")
    public List<Map<String, Object>> getMine(Authentication auth) {
        Account account = resolveAccount(auth);

        return repository.findByAccount_Id(account.getId())
                .stream().map(this::toMap).toList();
    }

    //створити волонтерство
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Volonteering v, Authentication auth) {
        Account account = resolveAccount(auth);

        if (account.getRole() == Role.ROLE_SHELTER) {
            Optional<Shelter> shelter = shelterRepository.findByAccount(account);
            if (shelter.isEmpty() || shelter.get().getPhoneNumber() == null || shelter.get().getPhoneNumber().isBlank()) {
                return ResponseEntity.status(403).body(Map.of(
                        "error", "phone_required",
                        "message", "Вкажіть номер телефону притулку перед створенням події"
                ));
            }
        } else {
            Optional<User> user = userRepository.findByAccount(account);
            if (user.isEmpty() || user.get().getPhoneNumber() == null || user.get().getPhoneNumber().isBlank()) {
                return ResponseEntity.status(403).body(Map.of(
                        "error", "phone_required",
                        "message", "Вкажіть номер телефону у профілі перед створенням події"
                ));
            }
        }

        v.setId(null);
        v.setAccount(account);
        Volonteering saved = repository.save(v);
        return ResponseEntity.ok(Map.of("status", "created", "event", toMap(saved)));
    }

    // просто допоміжний метод для конвертації сутності в Map
    private Map<String, Object> toMap(Volonteering v) {

        Map<String, Object> m = new HashMap<>();

        m.put("id", v.getId());
        m.put("name", v.getName());
        m.put("description", v.getDescription());
        m.put("dateOfEvent", v.getDateOfEvent());

        if (v.getAddress() != null) {
            m.put("city", v.getAddress().getCity());
            m.put("region", v.getAddress().getRegion());
            m.put("street", v.getAddress().getStreet());
        }

        if (v.getAccount() != null) {
            m.put("accountId", v.getAccount().getId());
            m.put("organizerRole", v.getAccount().getRole());

            if (v.getAccount().getRole() == Role.ROLE_SHELTER) {
                shelterRepository.findByAccount(v.getAccount()).ifPresent(shelter -> {
                    m.put("organizerName", shelter.getName());
                    m.put("organizerPhone", shelter.getPhoneNumber());
                    m.put("organizerSocialLinks", shelter.getSocialLinks());
                });
            } else {
                userRepository.findByAccount(v.getAccount()).ifPresent(user -> {
                    String fullName = String.join(" ",
                            user.getFirstName() != null ? user.getFirstName() : "",
                            user.getLastName() != null ? user.getLastName() : ""
                    ).trim();
                    m.put("organizerName", fullName.isEmpty()
                            ? v.getAccount().getLogin()
                            : fullName);
                    m.put("organizerPhone", user.getPhoneNumber());
                });
            }
        }

        return m;
    }

    private Account resolveAccount(Authentication auth) {
        return accountRepository.findByLogin(auth.getName())
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }
}