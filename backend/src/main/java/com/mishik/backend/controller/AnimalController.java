package com.mishik.backend.controller;

import com.mishik.backend.embedded.DonationDetails;
import com.mishik.backend.entity.Animal;
import com.mishik.backend.enums.Sex;
import com.mishik.backend.repository.AnimalRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
            @RequestParam(required = false) Long typeId,
            @RequestParam(required = false) Long shelterId
    ) {

        List<Animal> animals;

//        if (shelterId != null && sex != null && typeId != null){
//            animals = repository.findByShelterIdAndSexAndAnimalType_Id(shelterId,sex,typeId);
//        }
//        else if(shelterId != null && sex != null){
//            animals = repository.findByShelterIdAndSex(shelterId,sex);
//        }
//        else if (shelterId != null) {
//            animals = repository.findByShelter_Id(shelterId);
//        }
//        else if (sex != null && typeId != null) {
//            animals = repository.findBySexAndAnimalType_Id(sex, typeId);
//        }
//        else if (sex != null) {
//            animals = repository.findBySex(sex);
//        }
//        else if (typeId != null) {
//            animals = repository.findByAnimalType_Id(typeId);
//        }
//        else {
//            animals = repository.findAll();
//        }

        animals = repository.findFiltered(shelterId, sex, typeId);

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
        m.put("imageUrl", a.getImageUrl());
        m.put("shelterDonationDetails", toMap(a.getShelter().getDonationDetails()));

        return m;
    }

    //тварина за id
    private Map<String, Object> toMap(DonationDetails d) {
        if (d == null) {
            return null;
        }

        Map<String, Object> m = new HashMap<>();

        m.put("donationUrl", d.getDonationUrl());

        return m;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getById(@PathVariable Long id) {

        Animal animal = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal not found"));

        return toMap(animal);
    }

    @PostMapping("/upload")
    public Map<String, String> upload(@RequestParam MultipartFile file) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadDir = Paths.get("uploads/images");
        Files.createDirectories(uploadDir);
        Files.copy(file.getInputStream(), uploadDir.resolve(filename));

        Map<String, String> result = new HashMap<>();
        result.put("url", "/images/" + filename);
        return result;
    }



}
