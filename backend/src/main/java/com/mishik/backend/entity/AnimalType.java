package com.mishik.backend.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
@Entity
public class AnimalType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usefulInfo;

    public AnimalType() {
    }

    public AnimalType(Long id, String usefulInfo) {
        this.id = id;
        this.usefulInfo = usefulInfo;
    }
    public AnimalType(String usefulInfo) {
        this.usefulInfo = usefulInfo;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsefulInfo() {
        return usefulInfo;
    }

    public void setUsefulInfo(String usefulInfo) {
        this.usefulInfo = usefulInfo;
    }
}