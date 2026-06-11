package com.mishik.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class OverpassService {

    private final WebClient client;

    public OverpassService(WebClient overpassWebClient) {
        this.client = overpassWebClient;
    }

    private static final String query = """
            [out:json][timeout:120];
            
            area["ISO3166-1"="UA"][admin_level=2]->.country;
            
            (
              node["amenity"="veterinary"](area.country);
              way["amenity"="veterinary"](area.country);
              relation["amenity"="veterinary"](area.country);
            );
            
            out center tags;
            """;

    public Mono<String> fetchVetClinics() {
        return client.post()
                .bodyValue(query)
                .retrieve()
                .bodyToMono(String.class);
    }
}