package com.entite_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entite_contact")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntiteContact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "entite_id")
    private Entite entite;

    private String telephone;
    private String email;
    private String gsm;
    private String fax;
    private String siteWeb;
    private String boitePostal;
    private String adresse;
    private String ville;
    private String codePostal;
    private String pays;
    private String poste;
    private String languesParles;
} 