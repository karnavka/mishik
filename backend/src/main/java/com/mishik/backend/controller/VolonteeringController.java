package com.mishik.backend.controller;

import com.mishik.backend.entity.Volonteering;
import com.mishik.backend.repository.VolonteeringRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/volunteering")
public class VolonteeringController {

    private final VolonteeringRepository repository;

    public VolonteeringController(VolonteeringRepository repository) {
        this.repository = repository;
    }

    // -------------------------------
    // приклад : GET /volonteering?city=Kyiv
    // приклад : GET /volonteering?region=Kyivska
    // приклад : GET /volonteering?city=Kyiv&region=Kyivska
    // фільтрація волонтерств по місту та/або регіоні
    @GetMapping
    public List<Map<String, Object>> getVolonteering(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String region
    ) {

        List<Volonteering> list;

        if (city != null && region != null) {
            list = repository.findByAddress_CityAndAddress_Region(city, region);
        }
        else if (city != null) {
            list = repository.findByAddress_City(city);
        }
        else if (region != null) {
            list = repository.findByAddress_Region(region);
        }
        else {
            list = repository.findAll();
        }

        return list.stream()
                .map(this::toMap)
                .toList();
    }

  
    // просто допоміжний метод для конвертації сутності в Map
    private Map<String, Object> toMap(Volonteering v) {

        Map<String, Object> m = new HashMap<>();

        m.put("id", v.getId());
        m.put("name", v.getName());
        m.put("description", v.getDescription());
        m.put("dateOfEvent", v.getDateOfEvent());

        if (v.getUser() != null) {
            m.put("userId", v.getUser().getId());
            m.put("userName", v.getUser().getFirstName());
        }

        if (v.getAddress() != null) {
            m.put("city", v.getAddress().getCity());
            m.put("region", v.getAddress().getRegion());
            m.put("street", v.getAddress().getStreet());
            m.put("latitude", v.getAddress().getLatitude());
            m.put("longitude", v.getAddress().getLongitude());
        }

        return m;
    }

    //створити волонтерство
    @PostMapping
    public Map<String, Object> create(@RequestBody Volonteering v, Authentication auth) {

        v.setId(null);
        repository.save(v);

        return Map.of("status", "created");
    }
}