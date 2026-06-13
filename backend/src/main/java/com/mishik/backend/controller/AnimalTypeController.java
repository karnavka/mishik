package com.mishik.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mishik.backend.entity.AnimalType;
import com.mishik.backend.repository.AnimalTypeRepository;

@RestController
@RequestMapping("/api/animal-types")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AnimalTypeController {

    private final AnimalTypeRepository repository;

    public AnimalTypeController(AnimalTypeRepository repository) {
        this.repository = repository;
    }

    // GET /animal-types
    // взяти всі види тварин для переліку на фронтенді
    @GetMapping
    public List<Map<String, Object>> getAll() {

        return repository.findAll()
                .stream()
                .map(this::toMap)
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> req) {
        Object rawType = req.get("type");
        String type = rawType instanceof String ? ((String) rawType).trim() : "";

        if (type.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "type_required",
                    "message", "Animal type is required"
            ));
        }

        AnimalType animalType = repository.findByUsefulInfoIgnoreCase(type)
                .orElseGet(() -> repository.save(new AnimalType(type)));

        return ResponseEntity.ok(toMap(animalType));
    }

    private Map<String, Object> toMap(AnimalType t) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", t.getId());
        m.put("type", t.getUsefulInfo());
        return m;
    }
}
