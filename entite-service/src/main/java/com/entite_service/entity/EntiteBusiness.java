package com.entite_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entite_business")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntiteBusiness {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "entite_id")
    @JsonBackReference
    private Entite entite;

    private String type;
    private String SH;
    private Integer risk;
    private Integer tome;
    private String typePrixMoyen;
    private String effectif;
    private String capital;
    private String formeJuridique;
    private String dateCreation;
    private String activite;
    private String secteur;
    private String secteurEn;
    private String sousSecteur;
    private String sousSecteurEn;
    private String presentation;
    private String presentationEn;
    private String reference;
    private String position;
    private String marqueRepresente;
    private String actionnaires;
    private String chiffreAffaire;
    private String filiales;
    private String fourchettePrix;
    private String certifications;
    private String informationComplementaire;
    private String moyenPaiement;
    private String quantite;
    private String chiffres;
    private String actions;
    private String objectifs;
    private String missions;
    private String marches;
    private String activitesEn;
    private String typeEntreprise;
    private String domaine;
    private String prixMoyenEuro;
    private String prixMoyenDollar;
    private String prixMoyenMad;
    private String fourchetteType;
    private String fourchetteEuro;
    private String fourchetteDollar;
    private String regime;
    private String domainesPrioritaires;
} 