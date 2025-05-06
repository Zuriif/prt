package com.fonctionnaire_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fonctionnaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String gsm;
    private String profil;

    @Column(name = "entite_id")
    private Long entiteId; // référence à l'entité dans entite-service
}
