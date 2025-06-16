package com.entite_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entite_additional")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntiteAdditional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "entite_id")
    @JsonBackReference
    private Entite entite;
    
    private String textSeo;
    private String metaTitle;
    private String metaDescription;
    private String titreAriane;
    private String slug;
    private String langueSite;
    private String keywords;
    private String keywordsEn;
    private String caExport;
    private String maisonMere;
    private String groupe;
    private String population;
    private String nombreCommune;
    private String nombreDouar;
    private String domainesCompetence;
    private String missionPositionnement;
    private String recentesInterventions;
    private String presentationExpertise;
    private String offresAtouts;
    private String titreMiseAvant;
    private String sex;
    private String language;
    private String nationality;
    private String physicalDescription;
    private String charges;
    private String jurisdiction;
    private String incorporationDate;
    private String inactivationDate;
    private String status;
    private String poids;
    private String document;
    private String alias;
    private String secondName;
    private String usine;
    private String tomes;
    private String date;
    private String l3;
    private String l8;
    private String l11;
    private String l12;
    private String l13;
    private String l14;
    private String l15;
    private String l16;
    private String l17;
    private String l18;
    private String l19;
    private String u5;
    private String u8;
    private String u9;
    private String u10;
    private String u11;
    private String u12;
    private String u15;
    private String u16;
    private String u17;
    private String u18;
    private String u19;
} 