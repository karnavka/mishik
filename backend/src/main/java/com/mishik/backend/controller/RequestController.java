package com.mishik.backend.controller;

import com.mishik.backend.dao.AccountRepository;
import com.mishik.backend.embedded.RequestId;
import com.mishik.backend.entity.Account;
import com.mishik.backend.entity.Animal;
import com.mishik.backend.entity.Request;
import com.mishik.backend.entity.User;
import com.mishik.backend.enums.RequestStatus;
import com.mishik.backend.repository.AnimalRepository;
import com.mishik.backend.repository.RequestRepository;
import com.mishik.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/adoption-requests")
public class RequestController {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final RequestRepository adoptionRequestRepository;
    private final AnimalRepository animalRepository;

    public RequestController(AccountRepository accountRepository,
                             UserRepository userRepository,
                            RequestRepository adoptionRequestRepository, AnimalRepository animalRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.adoptionRequestRepository = adoptionRequestRepository;
        this.animalRepository = animalRepository;
    }

    @PostMapping
    public Map<String, Object> createRequest(
            Authentication authentication,
            @RequestBody Map<String, Object> req
    ) {
        String login = authentication.getName();

        Account account = accountRepository.findByLogin(login)
                .orElseThrow();

        User user = userRepository.findByAccount(account)
                .orElseThrow();

        Long animalId = Long.parseLong(req.get("animalId").toString());

        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RuntimeException("Animal not found"));

        Request ar = new Request();

        // Embedded ID (ВАЖЛИВО)
        RequestId id = new RequestId();
        id.setUserId(user.getId());
        id.setAnimalId(animal.getId());
        ar.setId(id);

        ar.setUser(user);
        ar.setAnimal(animal);

        ar.setStatus(RequestStatus.PENDING);
        ar.setCreatedDate(LocalDateTime.now());

        adoptionRequestRepository.save(ar);

        return Map.of(
                "status", "created",
                "animalId", animalId,
                "userId", user.getId()
        );
    }
}

