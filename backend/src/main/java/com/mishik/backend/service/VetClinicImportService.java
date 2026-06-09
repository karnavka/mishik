package com.mishik.backend.service;

import com.mishik.backend.embedded.Address;
import com.mishik.backend.entity.Clinic;
import com.mishik.backend.repository.ClinicRepository;


import com.mishik.backend.dto.OsmElement;
import com.mishik.backend.dto.OverpassResponse;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class VetClinicImportService {

    private final ClinicRepository clinicRepository;

    public VetClinicImportService(ClinicRepository clinicRepository) {
        this.clinicRepository = clinicRepository;
    }

    public void importClinics(OverpassResponse response) {

        for (OsmElement el : response.elements) {

            String name = get(el.tags, "name");

            if ("N/A".equals(name)) {
                continue;
            }

            if (clinicRepository.existsByName(name)) {
                continue;
            }

            Clinic clinic = new Clinic();

            clinic.setName(name);
            clinic.setPhoneNumber(get(el.tags,
                    "phone",
                    "contact:phone"));

            clinic.setHoursOfOperation(
                    get(el.tags, "opening_hours")
            );

            Address address = new Address();

            address.setStreet(
                    get(el.tags, "addr:street")
            );

            address.setCity(
                    get(el.tags, "addr:city")
            );

            double lat = (el.lat != 0)
                    ? el.lat
                    : el.center.lat;

            double lon = (el.lon != 0)
                    ? el.lon
                    : el.center.lon;

            address.setLatitude(lat);
            address.setLongitude(lon);

            clinic.setAddress(address);

            clinicRepository.save(clinic);
        }
    }

    private String get(Map<String,String> tags, String... keys) {
        if (tags == null) return null;

        for (String key : keys) {
            String value = tags.get(key);
            if (value != null && !value.isBlank()) {
                return value;
            }
        }

        return null;
    }
}