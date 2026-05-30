package com.mishik.backend.controller;

import com.mishik.backend.entity.Animal;
import com.mishik.backend.enums.Sex;
import com.mishik.backend.repository.AnimalRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/animals")
public class AnimalController {

    private final AnimalRepository repository;

    public AnimalController(AnimalRepository repository) {
        this.repository = repository;
    }

 // -------------------------------
    // Приклад : GET /animals/shelter/1
    // Знаходження всіх тварин, які знаходяться в конкретному притулку
 // -------------------------------
    @GetMapping("/shelter/{id}")
    public List<Map<String, Object>> getByShelter(@PathVariable Long id) {

        return repository.findByShelter_Id(id)
                .stream()
                .map(this::toMap)
                .toList();
    }

    // -------------------------------
    // для фільтрівання по параметрах 
    // приклад : GET /animals?sex=MALE&typeId=1
    // -------------------------------
    @GetMapping
    public List<Map<String, Object>> getFiltered(
            @RequestParam(required = false) Sex sex,
            @RequestParam(required = false) Long typeId
    ) {

        List<Animal> animals;

        if (sex != null && typeId != null) {
            animals = repository.findBySexAndAnimalType_Id(sex, typeId);
        }
        else if (sex != null) {
            animals = repository.findBySex(sex);
        }
        else if (typeId != null) {
            animals = repository.findByAnimalType_Id(typeId);
        }
        else {
            animals = repository.findAll();
        }

        return animals.stream()
                .map(this::toMap)
                .toList();
    }
//просто допоміжний метод для конвертації сутності в Map 
    private Map<String, Object> toMap(Animal a) {
        Map<String, Object> m = new HashMap<>();

        m.put("id", a.getId());
        m.put("name", a.getName());
        m.put("age", a.getAge());
        m.put("height", a.getHeight());
        m.put("sex", a.getSex());
        m.put("description", a.getDescription());

        m.put("animalTypeId", a.getAnimalType().getId());
        m.put("animalType", a.getAnimalType().getUsefulInfo());

        m.put("shelterId", a.getShelter().getId());
        m.put("shelterName", a.getShelter().getName());

        return m;
    }
}