package com.media_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomFichier;
    private String cheminFichier;
    private String type; // exemple : image/jpeg, application/pdf

    @Column(name = "entite_id")
    private Long entiteId;
}
