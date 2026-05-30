package com.mishik.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mishik.backend.entity.Clinic;
import com.mishik.backend.repository.ClinicRepository;


import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/clinics")
public class ClinicController {

    private final ClinicRepository repository;

    public ClinicController(ClinicRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Map<String, Object>> getClinics(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String region
    ) {

        List<Clinic> clinics;

        if (city != null && region != null) {
            clinics = repository.findByAddress_CityAndAddress_Region(city, region);
        }
        else if (city != null) {
            clinics = repository.findByAddress_City(city);
        }
        else if (region != null) {
            clinics = repository.findByAddress_Region(region);
        }
        else {
            clinics = repository.findAll();
        }

        return clinics.stream()
                .map(this::toMap)
                .toList();
    }

    // -----------------------------
    // ENTITY -> MAP
    // -----------------------------
    private Map<String, Object> toMap(Clinic c) {
        Map<String, Object> m = new HashMap<>();

        m.put("id", c.getId());
        m.put("name", c.getName());
        m.put("phoneNumber", c.getPhoneNumber());
        m.put("hoursOfOperation", c.getHoursOfOperation());

        // address flatten (дуже важливо для фронту)
        if (c.getAddress() != null) {
            m.put("city", c.getAddress().getCity());
            m.put("region", c.getAddress().getRegion());
            m.put("street", c.getAddress().getStreet());
            m.put("latitude", c.getAddress().getLatitude());
            m.put("longitude", c.getAddress().getLongitude());
        }

        return m;
    }
}
//GET /clinics?city=Kyiv
//GET /clinics?region=Kyivska