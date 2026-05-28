package com.mishik.backend.embedded;

import jakarta.persistence.Embeddable;

@Embeddable
public class Address {

    private String region; // необов'язкова область

    private String city;

    private String street;

    private Double latitude;
    
    private Double longitude;

}