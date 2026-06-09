package com.mishik.backend.dto;

import com.mishik.backend.enums.Sex;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnimalRequest {
    private String name;
    private byte age;
    private int height;
    private Sex sex;
    private String description;
    private Long animalTypeId;
}