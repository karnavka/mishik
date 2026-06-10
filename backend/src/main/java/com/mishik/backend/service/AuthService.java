package com.mishik.backend.service;

import com.mishik.backend.dto.LoginRequest;
import com.mishik.backend.embedded.Address;
import com.mishik.backend.embedded.DonationDetails;
import com.mishik.backend.entity.Account;
import com.mishik.backend.entity.Shelter;
import com.mishik.backend.entity.User;
import com.mishik.backend.enums.Role;
import com.mishik.backend.enums.Sex;
import com.mishik.backend.repository.AccountRepository;
import com.mishik.backend.repository.ShelterRepository;
import com.mishik.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final ShelterRepository shelterRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AccountRepository accountRepository,
            UserRepository userRepository,
            ShelterRepository shelterRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.shelterRepository = shelterRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, String> login(LoginRequest request) {
        Account account = accountRepository.findByLogin(request.login)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!passwordEncoder.matches(request.password, account.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(account.getLogin(), account.getRole().name());

        return Map.of(
                "token", token,
                "role", roleForClient(account.getRole())
        );
    }

    public Map<String, Object> register(Map<String, Object> req) {
        String role = stringValue(req.get("role"));

        if ("SHELTER".equalsIgnoreCase(role) || "ROLE_SHELTER".equalsIgnoreCase(role)) {
            return registerShelter(req);
        }

        return registerUser(req);
    }

    public Map<String, Object> registerUser(Map<String, Object> req) {
        Account account = createAccount(req, Role.ROLE_USER);

        User user = new User();
        user.setAccount(account);
        user.setFirstName(stringValue(req.get("firstName")));
        user.setLastName(stringValue(req.get("lastName")));
        user.setPatronymic(stringValue(req.get("patronymic")));
        user.setSex(parseSex(req.get("sex")));

        user = userRepository.save(user);

        return authResponse(account, Map.of("userId", user.getId()));
    }

    public Map<String, Object> registerShelter(Map<String, Object> req) {
        Account account = createAccount(req, Role.ROLE_SHELTER);

        Shelter shelter = new Shelter();
        shelter.setAccount(account);
        shelter.setName(stringValue(req.get("name")));
        shelter.setPhoneNumber(stringValue(req.get("phoneNumber")));
        shelter.setAdoptionConditions(stringValue(req.get("adoptionConditions")));

        Object address = req.get("address");
        if (address instanceof Map<?, ?> addressMap) {
            shelter.setAddress(toAddress(addressMap));
        }

        Object donationDetails = req.get("donationDetails");
        if (donationDetails instanceof Map<?, ?> donationMap) {
            shelter.setDonationDetails(toDonationDetails(donationMap));
        }

        shelter = shelterRepository.save(shelter);

        return authResponse(account, Map.of("shelterId", shelter.getId()));
    }

    private Account createAccount(Map<String, Object> req, Role role) {
        String login = stringValue(req.get("login"));
        String password = stringValue(req.get("password"));

        if (login == null || login.isBlank()) {
            throw new RuntimeException("Login is required");
        }

        if (password == null || password.isBlank()) {
            throw new RuntimeException("Password is required");
        }

        if (accountRepository.findByLogin(login).isPresent()) {
            throw new RuntimeException("Login already exists");
        }

        Account account = new Account();
        account.setLogin(login);
        account.setPassword(passwordEncoder.encode(password));
        account.setRole(role);

        return accountRepository.save(account);
    }

    private Map<String, Object> authResponse(Account account, Map<String, Object> extra) {
        Map<String, Object> res = new HashMap<>();

        res.put("status", "created");
        res.put("accountId", account.getId());
        res.put("login", account.getLogin());
        res.put("role", roleForClient(account.getRole()));
        res.put("token", jwtService.generateToken(account.getLogin(), account.getRole().name()));
        res.putAll(extra);

        return res;
    }

    private Address toAddress(Map<?, ?> m) {
        Address address = new Address();

        address.setRegion(stringValue(m.get("region")));
        address.setCity(stringValue(m.get("city")));
        address.setStreet(stringValue(m.get("street")));
        address.setLatitude(doubleValue(m.get("latitude")));
        address.setLongitude(doubleValue(m.get("longitude")));

        return address;
    }

    private DonationDetails toDonationDetails(Map<?, ?> m) {
        DonationDetails details = new DonationDetails();
        details.setDonationUrl(stringValue(m.get("donationUrl")));
        return details;
    }

    private Sex parseSex(Object value) {
        String sex = stringValue(value);

        if (sex == null || sex.isBlank()) {
            return Sex.UNKNOWN;
        }

        return Sex.valueOf(sex.toUpperCase());
    }

    private Double doubleValue(Object value) {
        if (value == null) {
            return null;
        }

        if (value instanceof Number number) {
            return number.doubleValue();
        }

        String text = value.toString();
        return text.isBlank() ? null : Double.valueOf(text);
    }

    private String stringValue(Object value) {
        return value == null ? null : value.toString();
    }

    private String roleForClient(Role role) {
        return role.name().replaceFirst("^ROLE_", "");
    }
}
