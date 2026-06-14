package com.mishik.backend.embedded;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteId implements Serializable {

    private Long userId;
    private Long animalId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FavoriteId f)) return false;
        return Objects.equals(userId, f.userId) && Objects.equals(animalId, f.animalId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, animalId);
    }
}