package com.mishik.backend.embedded;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;

@Embeddable
public class RequestId implements Serializable {

    private Long userId;
    private Long animalId;

    public RequestId() {}

    public RequestId(Long userId, Long animalId) {
        this.userId = userId;
        this.animalId = animalId;
    }

    // ОБОВʼЯЗКОВО
    @Override
    public boolean equals(Object o) { 
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RequestId that = (RequestId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(animalId, that.animalId);
     }

    @Override
    public int hashCode() {
        return Objects.hash(userId, animalId);
    }
}
