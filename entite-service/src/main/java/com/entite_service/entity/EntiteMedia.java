package com.entite_service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entite_media")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntiteMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "entite_id")
    @JsonBackReference
    private Entite entite;

    private String video1;
    private String video2;
    private String video3;
    private String image1;
    private String image2;
    private String image3;
    private String imageFondDesk;
    private String imageFondMob;
    private String imagesAdditionnelles;
    private String produitListingDesk;
    private String produitListingMob;
    private String imageProduitDesk;
    private String imageProduitMob;
    private String partenaireImageDesk;
    private String partenaireImageMob;
    private String certifImageDesk;
    private String certifImageMob;
    private String producteurFondDesk;
    private String producteurFondMob;
    private String logo;
    private String file;
    private String new1;
    private String new2;
    private String new3;
} 