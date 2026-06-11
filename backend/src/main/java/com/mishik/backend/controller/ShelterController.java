package com.mishik.backend.controller;

import java.util.List;

import com.mishik.backend.dto.AnimalRequest;
import com.mishik.backend.embedded.DonationDetails;
import com.mishik.backend.entity.*;
import com.mishik.backend.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import java.util.Map;

@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    private final ShelterRepository repository;
    private final AccountRepository accountRepository;
    private final AnimalRepository animalRepository;
    private final AnimalTypeRepository animalTypeRepository;
    private final RequestRepository requestRepository;

    public ShelterController(ShelterRepository repository, AccountRepository accountRepository, AnimalRepository animalRepository, AnimalTypeRepository animalTypeRepository, RequestRepository requestRepository) {
        this.repository = repository;
        this.accountRepository = accountRepository;
        this.animalRepository = animalRepository;
        this.animalTypeRepository = animalTypeRepository;
        this.requestRepository = requestRepository;

    }

    //--- тут спочатку публічні: ---

     // -------------------------------
    // приклад : GET /shelters?city=Kyiv
    // приклад : GET /shelters?region=Kyivska
    // приклад : GET /shelters?city=Kyiv&region=Kyivska
    // фільтрація притулків по місту та/або регіону (параметри необов'язкові)
    // -------------------------------
    @GetMapping
    public List<Map<String, Object>> getShelters(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String region
    ) {

        List<Shelter> shelters;

        if (city != null && region != null) {
            shelters = repository.findByAddress_CityAndAddress_Region(city, region);
        }
        else if (city != null) {
            shelters = repository.findByAddress_City(city);
        }
        else if (region != null) {
            shelters = repository.findByAddress_Region(region);
        }
        else {
            shelters = repository.findAll();
        }

        return shelters.stream()
                .map(this::toMap)
                .toList();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getShelter(
            @PathVariable Long id
    ) {

        Shelter shelter = repository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Shelter not found"
                        )
                );

        return toMap(shelter);
    }



    //--- далі методи для авторизованого притулку: ---

    //зяти інфу про себе
    @GetMapping("/me")
    public Map<String, Object> getMe(Authentication authentication) {

        String login = authentication.getName();

        Account account = accountRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Shelter shelter = repository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        return toMap(shelter);
    }
    //оновити свій профіль
    @PutMapping("/me")
    public Map<String, Object> updateMe(
            Authentication authentication,
            @RequestBody Map<String, Object> req
    ) {

        String login = authentication.getName();

        Account account = accountRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Shelter shelter = repository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        shelter.setName((String) req.get("name"));
        shelter.setPhoneNumber((String) req.get("phoneNumber"));
        shelter.setAdoptionConditions((String) req.get("adoptionConditions"));

        Object donationDetails = req.get("donationDetails");
        if (donationDetails instanceof Map<?, ?> donationMap) {
            shelter.setDonationDetails(toDonationDetails(donationMap));
        }

        repository.save(shelter);

        return Map.of("status", "updated");
    }
    //отримати своїх тварин
    @GetMapping("/me/animals")
    public List<Map<String, Object>> getMyAnimals(
            Authentication authentication
    ) {

        String login = authentication.getName();

        Account account = accountRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Shelter shelter = repository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        return animalRepository.findByShelter_Id(shelter.getId())
                .stream()
                .map(this::toMap)
                .toList();
    }

    //видалити втою тварину
    @DeleteMapping("/me/{animalId}")
    public Map<String, String> deleteAnimal(
            @PathVariable Long animalId,
            Authentication authentication
    ) {

        String login = authentication.getName();

        Account account = accountRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Shelter shelter = repository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        Animal animal = animalRepository.findById(animalId)
                .orElseThrow();

        if (!animal.getShelter().getId().equals(shelter.getId())) {
            throw new RuntimeException("Access denied");
        }

        animalRepository.delete(animal);

        return Map.of("status", "deleted");
    }

    //оновити свою тварину
    @PutMapping("/me/{animalId}")
    public Map<String, Object> updateAnimal(
            @PathVariable Long animalId,
            Authentication authentication,
            @RequestBody Animal req
    ) {

        String login = authentication.getName();

        Account account = accountRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Shelter shelter = repository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new RuntimeException("Animal not found"));

        if (!animal.getShelter().getId().equals(shelter.getId())) {
            throw new RuntimeException("Access denied");
        }

        animal.setName(req.getName());
        animal.setAge(req.getAge());
        animal.setHeight(req.getHeight());
        animal.setDescription(req.getDescription());
        animal.setSex(req.getSex());

        animalRepository.save(animal);

        return toMap(animal);
    }


    //додати тварину
    @PostMapping("/me/animals")
    public Map<String, Object> createAnimal(
            Authentication authentication,
            @RequestBody AnimalRequest req
    ) {

        String login = authentication.getName();

        Account account = accountRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Shelter shelter = repository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        Animal animal = new Animal();
        animal.setName(req.getName());
        animal.setAge(req.getAge());
        animal.setHeight(req.getHeight());
        animal.setSex(req.getSex());
        animal.setDescription(req.getDescription());

        animal.setShelter(shelter);

        if (req.getAnimalTypeId() != null) {
            AnimalType type = animalTypeRepository.findById(req.getAnimalTypeId())
                    .orElseThrow(() -> new RuntimeException("AnimalType not found"));

            animal.setAnimalType(type);
        }

        Animal saved = animalRepository.save(animal);

        return Map.of(
                "status", "created",
                "animal", toMap(saved)
        );
    }

    //отримати надіслені собі реквести на тварин
    @GetMapping("/api/shelters/me/adoption-requests")
    public List<Map<String, Object>> getShelterRequests(Authentication authentication) {

        String login = authentication.getName();

        Account account = accountRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Shelter shelter = repository.findByAccount(account)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        return requestRepository.findByAnimal_Shelter_Id(shelter.getId())
                .stream()
                .map(this::toMap)
                .toList();
    }


    //***** допоміжне ****

    // просто допоміжний метод для конвертації сутності в Map
    private Map<String, Object> toMap(Shelter s) {
        Map<String, Object> m = new HashMap<>();

        m.put("id", s.getId());
        m.put("name", s.getName());
        m.put("phoneNumber", s.getPhoneNumber());
        m.put("adoptionConditions", s.getAdoptionConditions());
        m.put("donationDetails", toMap(s.getDonationDetails()));
        m.put("imageUrl", s.getImageUrl());

        if (s.getAccount() != null) {
            m.put("login", s.getAccount().getLogin());
            m.put("role", s.getAccount().getRole());
        }


        if (s.getAddress() != null) {
            m.put("city", s.getAddress().getCity());
            m.put("region", s.getAddress().getRegion());
            m.put("street", s.getAddress().getStreet());
            m.put("latitude", s.getAddress().getLatitude());
            m.put("longitude", s.getAddress().getLongitude());
        }

        return m;
    }

    private DonationDetails toDonationDetails(Map<?, ?> m) {
        DonationDetails details = new DonationDetails();

        details.setDonationUrl((String) m.get("donationUrl"));

        return details;
    }

    private Map<String, Object> toMap(DonationDetails d) {
        if (d == null) {
            return null;
        }

        Map<String, Object> m = new HashMap<>();

        m.put("donationUrl", d.getDonationUrl());

        return m;
    }

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

        return m;
    }

    private Map<String, Object> toMap(Request r) {
        Map<String, Object> m = new HashMap<>();

        m.put("userId", r.getUser().getId());
        m.put("userLogin", r.getUser().getAccount().getLogin());

        m.put("animalId", r.getAnimal().getId());
        m.put("animalName", r.getAnimal().getName());

        m.put("status", r.getStatus());
        m.put("createdDate", r.getCreatedDate());

        return m;
    }


}

//GET /shelters?city=Kyiv
//GET /shelters?region=Kyivska
//GET /shelters?city=Kyiv&region=Kyivska
