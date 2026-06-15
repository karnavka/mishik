package com.mishik.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mishik.backend.dto.OverpassResponse;
import com.mishik.backend.repository.ClinicRepository;
import com.mishik.backend.service.OverpassService;
import com.mishik.backend.service.VetClinicImportService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClinicLoader {

    @Bean
    CommandLineRunner loadClinics(
            OverpassService overpassService,
            VetClinicImportService importService,
            ClinicRepository clinicRepository
    ) {

        return args -> {
            if (clinicRepository.count() > 0) {
               System.out.println("Clinics already exist. Skipping import.");
               return;
           }

            try {

                String json = overpassService
                        .fetchVetClinics()
                        .block();

                ObjectMapper mapper = new ObjectMapper();

                OverpassResponse response =
                        mapper.readValue(
                                json,
                                OverpassResponse.class
                        );

                importService.importClinics(response);

                System.out.println(
                        "=== VET CLINICS IMPORTED SUCCESSFULLY ==="
                );

            } catch (Exception e) {

                System.err.println(
                        "=== FAILED TO IMPORT CLINICS ==="
                );

                e.printStackTrace();
            }
        };
    }
}