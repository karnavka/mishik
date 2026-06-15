// src/main/java/com/mishik/backend/controller/RequestController.java
package com.mishik.backend.controller;

import com.mishik.backend.repository.AccountRepository;
import com.mishik.backend.embedded.RequestId;
import com.mishik.backend.entity.*;
import com.mishik.backend.enums.RequestStatus;
import com.mishik.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/adoption-requests")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class RequestController {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final RequestRepository requestRepository;
    private final AnimalRepository animalRepository;
    private final ShelterRepository shelterRepository;

    public RequestController(
            AccountRepository accountRepository,
            UserRepository userRepository,
            RequestRepository requestRepository,
            AnimalRepository animalRepository,
            ShelterRepository shelterRepository
    ) {
        this.accountRepository  = accountRepository;
        this.userRepository     = userRepository;
        this.requestRepository  = requestRepository;
        this.animalRepository   = animalRepository;
        this.shelterRepository  = shelterRepository;
    }


    @PostMapping
    public ResponseEntity<?> createRequest(

            Authentication authentication,
            @RequestBody Map<String, Object> body
    ) {
        User user = resolveUser(authentication);

        if (user.getPhoneNumber() == null || user.getPhoneNumber().isBlank()) {
            return ResponseEntity.status(403).body(Map.of(
                    "error",   "phone_required",
                    "message", "Для подачі заявки необхідно вказати номер телефону"
            ));
        }

        Long animalId = Long.parseLong(body.get("animalId").toString());
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RuntimeException("Animal not found"));

        RequestId rid = new RequestId(user.getId(), animal.getId());

        if (requestRepository.existsById(rid)) {
            return ResponseEntity.status(409).body(Map.of(
                    "error",   "already_exists",
                    "message", "Заявку на цю тварину вже подано"
            ));
        }

        Request r = new Request();
        r.setId(rid);
        r.setUser(user);
        r.setAnimal(animal);
        r.setStatus(RequestStatus.PENDING);
        r.setCreatedDate(LocalDateTime.now());
        requestRepository.save(r);

        return ResponseEntity.ok(Map.of(
                "status",   "created",
                "animalId", animalId,
                "userId",   user.getId()
        ));
    }


    @GetMapping("/my")
    public List<Map<String, Object>> getMyRequests(Authentication authentication) {
        User user = resolveUser(authentication);
        return requestRepository.findByUser_Id(user.getId())
                .stream().map(this::toMap).toList();
    }

    @DeleteMapping("/{animalId}")
    public ResponseEntity<?> cancelRequest(
            @PathVariable Long animalId,
            Authentication authentication
    ) {
        User user = resolveUser(authentication);
        RequestId rid = new RequestId(user.getId(), animalId);

        Request r = requestRepository.findById(rid)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (r.getStatus() != RequestStatus.PENDING) {
            return ResponseEntity.status(409).body(Map.of(
                    "error",   "not_pending",
                    "message", "Можна скасувати лише заявку зі статусом PENDING"
            ));
        }

        requestRepository.delete(r);
        return ResponseEntity.ok(Map.of("status", "cancelled"));
    }


    @GetMapping("/shelter")
    public List<Map<String, Object>> getShelterRequests(Authentication authentication) {
        Shelter shelter = resolveShelter(authentication);
        return requestRepository.findByAnimal_Shelter_Id(shelter.getId())
                .stream().map(this::toMapFull).toList();
    }


    @GetMapping("/{animalId}/{userId}")
    public ResponseEntity<?> getRequestDetail(
            @PathVariable Long animalId,
            @PathVariable Long userId,
            Authentication authentication
    ) {
        Shelter shelter = resolveShelter(authentication);

        Request r = requestRepository.findById(new RequestId(userId, animalId))
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!r.getAnimal().getShelter().getId().equals(shelter.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "access_denied"));
        }

        return ResponseEntity.ok(toMapFull(r));
    }


    record StatusRequest(String status) {}
    @PatchMapping("/{animalId}/{userId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long animalId,
            @PathVariable Long userId,
            @RequestBody StatusRequest body,
            Authentication authentication
    ) {
        Shelter shelter = resolveShelter(authentication);

        Request r = requestRepository.findById(new RequestId(userId, animalId))
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!r.getAnimal().getShelter().getId().equals(shelter.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "access_denied"));
        }

        String newStatus = body.status();

        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "status is required"
            ));
        }

        newStatus = newStatus.trim();

        System.out.println("RECEIVED STATUS = [" + newStatus + "]");

        try {
            r.setStatus(RequestStatus.valueOf(newStatus.toUpperCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "invalid_status",
                    "received", newStatus,
                    "message", "Допустимі значення: APPROVED, REJECTED, PENDING"
            ));
        }
        requestRepository.save(r);
        return ResponseEntity.ok(Map.of("status", "updated", "newStatus",  body.status()));
    }

    @GetMapping("/{animalId}/{userId}/contact")
    public ResponseEntity<?> getContactLinks(
            @PathVariable Long animalId,
            @PathVariable Long userId,
            Authentication authentication
    ) {
        Shelter shelter = resolveShelter(authentication);

        Request r = requestRepository.findById(new RequestId(userId, animalId))
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!r.getAnimal().getShelter().getId().equals(shelter.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "access_denied"));
        }

        String phone = r.getUser().getPhoneNumber();
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.ok(Map.of(
                    "hasPhone", false,
                    "links",    Collections.emptyList()
            ));
        }

        String digits   = phone.replaceAll("\\D", "");
        String e164     = "+" + digits;

        List<Map<String, String>> links = new ArrayList<>();

        links.add(Map.of(
                "service", "telegram",
                "label",   "Telegram",
                "url",     "https://t.me/" + e164
        ));

        links.add(Map.of(
                "service", "viber",
                "label",   "Viber",
                "url",     "viber://chat?number=%2B" + digits
        ));

        links.add(Map.of(
                "service", "sms",
                "label",   "SMS",
                "url",     "sms:" + e164
        ));

        return ResponseEntity.ok(Map.of(
                "hasPhone", true,
                "phone",    e164,
                "links",    links
        ));
    }

    private User resolveUser(Authentication auth) {
        Account account = accountRepository.findByLogin(auth.getName())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Shelter resolveShelter(Authentication auth) {
        Account account = accountRepository.findByLogin(auth.getName())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return shelterRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));
    }

    private Map<String, Object> toMap(Request r) {
        Map<String, Object> m = new HashMap<>();
        m.put("animalId",    r.getAnimal().getId());
        m.put("animalName",  r.getAnimal().getName());
        m.put("status",      r.getStatus());
        m.put("createdDate", r.getCreatedDate());
        return m;
    }

    private Map<String, Object> toMapFull(Request r) {
        Map<String, Object> m = new HashMap<>();

        m.put("status",      r.getStatus());
        m.put("createdDate", r.getCreatedDate());

        Animal a = r.getAnimal();
        Map<String, Object> animal = new HashMap<>();
        animal.put("id",          a.getId());
        animal.put("name",        a.getName());
        animal.put("animalType",  a.getAnimalType() != null ? a.getAnimalType().getUsefulInfo() : null);
        animal.put("age",         a.getAge());
        animal.put("height",      a.getHeight());
        animal.put("sex",         a.getSex());
        animal.put("description", a.getDescription());
        animal.put("imageUrl",    a.getImageUrl());
        animal.put("shelterName", a.getShelter() != null ? a.getShelter().getName() : null);
        m.put("animal", animal);

        User u = r.getUser();
        Map<String, Object> user = new HashMap<>();
        user.put("id",          u.getId());
        user.put("login",       u.getAccount().getLogin());
        user.put("firstName",   u.getFirstName());
        user.put("lastName",    u.getLastName());
        user.put("patronymic",  u.getPatronymic());
        user.put("phoneNumber", u.getPhoneNumber());
        m.put("user", user);

        return m;
    }

    @GetMapping("/debug")
    public Map<String, Object> debug(Authentication authentication) {
        if (authentication == null) {
            return Map.of("error", "authentication is NULL — JwtFilter не спрацював");
        }
        return Map.of(
                "name",        authentication.getName(),
                "authorities", authentication.getAuthorities().toString(),
                "class",       authentication.getClass().getSimpleName()
        );
    }

    @GetMapping("/my/{animalId}")
    public ResponseEntity<?> getMyRequestDetail(
            @PathVariable Long animalId,
            Authentication authentication
    ) {
        User user = resolveUser(authentication);

        Request r = requestRepository.findById(new RequestId(user.getId(), animalId))
                .orElseThrow(() -> new RuntimeException("Request not found"));

        Map<String, Object> result = new HashMap<>();
        result.put("status",      r.getStatus());
        result.put("createdDate", r.getCreatedDate());

        Animal a = r.getAnimal();
        Map<String, Object> animalMap = new HashMap<>();
        animalMap.put("id",           a.getId());
        animalMap.put("name",         a.getName());
        animalMap.put("animalType",   a.getAnimalType() != null ? a.getAnimalType().getUsefulInfo() : null);
        animalMap.put("age",          a.getAge());
        animalMap.put("height",       a.getHeight());
        animalMap.put("sex",          a.getSex());
        animalMap.put("description",  a.getDescription());
        animalMap.put("imageUrl",     a.getImageUrl());
        animalMap.put("shelterName",  a.getShelter() != null ? a.getShelter().getName()        : null);
        animalMap.put("shelterId",    a.getShelter() != null ? a.getShelter().getId()          : null);
        animalMap.put("shelterPhone", a.getShelter() != null ? a.getShelter().getPhoneNumber() : null);
        result.put("animal", animalMap);

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id",    user.getId());
        userMap.put("login", user.getAccount().getLogin());
        result.put("user", userMap);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/adopted-animal-ids")
    public Set<Long> getAdoptedAnimalIds() {
        return requestRepository.findByStatus(RequestStatus.ACCEPTED)
                .stream()
                .map(r -> r.getAnimal().getId())
                .collect(java.util.stream.Collectors.toSet());
    }

    @GetMapping("/my-approved-animal-ids")
    public Set<Long> getMyApprovedAnimalIds(Authentication authentication) {
        User user = resolveUser(authentication);
        return requestRepository.findByUser_IdAndStatus(user.getId(), RequestStatus.ACCEPTED)
                .stream()
                .map(r -> r.getAnimal().getId())
                .collect(java.util.stream.Collectors.toSet());
    }

}