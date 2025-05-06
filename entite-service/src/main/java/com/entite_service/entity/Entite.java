package com.entite_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Entite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String libelle;
    private String adresse;
    private String codePostal;
    private String region;
    private String telephone;
    private String fax;
    private String email;
    private String source;
    private Integer effectif;
    private String formeJuridique;
    private String capitalSocial;

    @Temporal(TemporalType.DATE)
    private Date dateCreation;

    private String activites;
    private String produits;
    private String presentation;
    private String marqueRepresentee;

    @ManyToOne
    private TypeEntreprise typeEntreprise;

}
