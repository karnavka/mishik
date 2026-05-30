package com.mishik.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mishik.backend.repository.ShelterRepository;

@RestController
@RequestMapping("/shelters")
public class ShelterController {

    private final ShelterRepository repository;

    public ShelterController(ShelterRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<com.mishik.backend.entity.Shelter> getShelters(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String region
    ) {

        if (city != null && region != null) {
            return repository.findByAddress_CityAndAddress_Region(city, region);
        }

        if (city != null) {
            return repository.findByAddress_City(city);
        }

        if (region != null) {
            return repository.findByAddress_Region(region);
        }

        return repository.findAll();
    }
}

//GET /shelters?city=Kyiv
//GET /shelters?region=Kyivska
//GET /shelters?city=Kyiv&region=Kyivska