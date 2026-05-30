package com.mishik.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mishik.backend.repository.AnimalTypeRepository;

@RestController
@RequestMapping("/animal-types")
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
                .map(t -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", t.getId());
                    m.put("type", t.getUsefulInfo());
                    return m;
                })
                .toList();
    }
}
