package com.mishik.backend.controller;

import com.mishik.backend.embedded.FavoriteId;
import com.mishik.backend.entity.*;
import com.mishik.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class FavoriteController {

    private final AccountRepository  accountRepository;
    private final UserRepository     userRepository;
    private final AnimalRepository   animalRepository;
    private final FavoriteRepository favoriteRepository;

    public FavoriteController(
            AccountRepository  accountRepository,
            UserRepository     userRepository,
            AnimalRepository   animalRepository,
            FavoriteRepository favoriteRepository
    ) {
        this.accountRepository  = accountRepository;
        this.userRepository     = userRepository;
        this.animalRepository   = animalRepository;
        this.favoriteRepository = favoriteRepository;
    }

    // GET /api/favorites — список уподобаних тварин
    @GetMapping
    public List<Map<String, Object>> getFavorites(Authentication authentication) {
        User user = resolveUser(authentication);
        return favoriteRepository.findByUser_Id(user.getId())
                .stream()
                .map(f -> toMap(f.getAnimal()))
                .toList();
    }

    // POST /api/favorites/{animalId} — додати до уподобаних
    @PostMapping("/{animalId}")
    public ResponseEntity<?> addFavorite(
            @PathVariable Long animalId,
            Authentication authentication
    ) {
        User user = resolveUser(authentication);
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RuntimeException("Animal not found"));

        FavoriteId fid = new FavoriteId(user.getId(), animalId);

        if (favoriteRepository.existsById(fid)) {
            return ResponseEntity.status(409).body(Map.of(
                    "error", "already_favorited"
            ));
        }

        Favorite favorite = new Favorite(fid, user, animal);
        favoriteRepository.save(favorite);

        return ResponseEntity.ok(Map.of("status", "added", "animalId", animalId));
    }

    // DELETE /api/favorites/{animalId} — видалити з уподобаних
    @DeleteMapping("/{animalId}")
    public ResponseEntity<?> removeFavorite(
            @PathVariable Long animalId,
            Authentication authentication
    ) {
        User user = resolveUser(authentication);
        FavoriteId fid = new FavoriteId(user.getId(), animalId);

        if (!favoriteRepository.existsById(fid)) {
            return ResponseEntity.status(404).body(Map.of(
                    "error", "not_found"
            ));
        }

        favoriteRepository.deleteById(fid);
        return ResponseEntity.ok(Map.of("status", "removed", "animalId", animalId));
    }

    private User resolveUser(Authentication auth) {
        Account account = accountRepository.findByLogin(auth.getName())
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return userRepository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Map<String, Object> toMap(Animal a) {
        Map<String, Object> m = new HashMap<>();
        m.put("id",          a.getId());
        m.put("name",        a.getName());
        m.put("animalType",  a.getAnimalType() != null ? a.getAnimalType().getUsefulInfo() : null);
        m.put("age",         a.getAge());
        m.put("sex",         a.getSex());
        m.put("description", a.getDescription());
        m.put("imageUrl",    a.getImageUrl());
        m.put("shelterId",   a.getShelter() != null ? a.getShelter().getId()   : null);
        m.put("shelterName", a.getShelter() != null ? a.getShelter().getName() : null);
        return m;
    }
}