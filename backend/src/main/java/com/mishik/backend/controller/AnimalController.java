package com.mishik.backend.controller;

import com.mishik.backend.entity.Animal;
import com.mishik.backend.repository.AnimalRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/animals")
public class AnimalController {

    private final AnimalRepository repository;

    public AnimalController(AnimalRepository repository) {
        this.repository = repository;
    }

    //GET http://localhost:8080/animals/shelter/1
    @GetMapping("/animals/shelter/{id}")
public List<Map<String, Object>> getByShelter(@PathVariable Long id) {

    return repository.findByShelter_Id(id)
            .stream()
            .map(a -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", a.getId());
                m.put("name", a.getName());
                m.put("shelterName", a.getShelter().getName());
                return m;
            })
            .toList();
}
}