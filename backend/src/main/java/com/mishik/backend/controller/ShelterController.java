package com.mishik.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mishik.backend.repository.ShelterRepository;

import com.mishik.backend.entity.Shelter;

import java.util.HashMap;

import java.util.Map;

@RestController
@RequestMapping("/shelters")
public class ShelterController {

    private final ShelterRepository repository;

    public ShelterController(ShelterRepository repository) {
        this.repository = repository;
    }

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

    // -----------------------------
    // ENTITY -> MAP
    // -----------------------------
    private Map<String, Object> toMap(Shelter s) {
        Map<String, Object> m = new HashMap<>();

        m.put("id", s.getId());
        m.put("name", s.getName());
        m.put("phoneNumber", s.getPhoneNumber());
        m.put("adoptionConditions", s.getAdoptionConditions());

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
}

//GET /shelters?city=Kyiv
//GET /shelters?region=Kyivska
//GET /shelters?city=Kyiv&region=Kyivska