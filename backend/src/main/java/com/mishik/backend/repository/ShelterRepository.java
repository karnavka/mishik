package com.mishik.backend.repository;

import com.mishik.backend.entity.Shelter;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ShelterRepository extends JpaRepository<Shelter, Long> {

    List<Shelter> findByAddress_City(String city);

    List<Shelter> findByAddress_Region(String region);

    List<Shelter> findByAddress_CityAndAddress_Region(String city, String region);
}