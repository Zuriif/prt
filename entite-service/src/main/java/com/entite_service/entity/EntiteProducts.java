package com.entite_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entite_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntiteProducts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "entite_id")
    private Entite entite;

    private String produits;
    private String produitsEn;
    private String idProduitPrinciple;
    private String idCertification;
    private String certifs;
    private String partenaires;
    private String marquesCommerciales;
    private String nombreCooperatives;
    private String capacite;
    private String puissance;
    private String destinction;
    private String source;
    private String composition;
    private String dimention;
    private String specialite;
    private String activites;
    private String rubriques;
    private String autre;
    private String autres;
} 