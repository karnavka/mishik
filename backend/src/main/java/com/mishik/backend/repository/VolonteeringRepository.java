package com.mishik.backend.repository;

import com.mishik.backend.entity.Volonteering;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface VolonteeringRepository extends JpaRepository<Volonteering, Long> {

    List<Volonteering> findByAddress_City(String city);

    List<Volonteering> findByAddress_Region(String region);

    List<Volonteering> findByAddress_CityAndAddress_Region(String city, String region);

    List<Volonteering> findByAccount_Id(Integer accountId);
}
