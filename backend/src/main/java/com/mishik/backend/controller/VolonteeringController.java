package com.mishik.backend.controller;

import com.mishik.backend.entity.Volonteering;
import com.mishik.backend.repository.VolonteeringRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/volonteering")
public class VolonteeringController {

    private final VolonteeringRepository repository;

    public VolonteeringController(VolonteeringRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Volonteering> getVolonteering(
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
//GET /volonteering?city=Kyiv
//GET /volonteering?region=Kyivska