package com.mishik.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mishik.backend.entity.Clinic;
import com.mishik.backend.repository.ClinicRepository;

@RestController
@RequestMapping("/clinics")
public class ClinicController {

    private final ClinicRepository repository;

    public ClinicController(ClinicRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Clinic> getClinics(
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

//GET /clinics?city=Kyiv
//GET /clinics?region=Kyivska