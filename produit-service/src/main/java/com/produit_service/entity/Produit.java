package com.produit_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "produits")
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(length = 1000)
    private String description;

    private String categorie;
    private Double prix;

    @Column(name = "entite_id", nullable = false)
    private Long entiteId;

    // Additional fields from EntiteProducts
    private String activites;
    private String produits;
    private String marqueRepresentee;
    private String categories;
    private String sousCategories;
    private String marques;
    @Column(name = "product_references")
    private String productReferences;
    private Integer stock;
    private String caracteristiques;
    private String images;
    private String videos;
    private String documents;
    private String liens;
    private String tags;
    private String metaTitle;
    private String metaDescription;
    private String slug;
    private String titreAriane;
}
