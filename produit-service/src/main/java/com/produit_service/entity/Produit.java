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

    @Column(columnDefinition = "LONGTEXT")
    private String images;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @Builder.Default
    private java.util.Date createdAt = new java.util.Date();

}
