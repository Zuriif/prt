package com.entite_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entite_location")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntiteLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "entite_id")
    private Entite entite;
    
    private String administration;
    private String ports;
    private String cheminDeFer;
    private String enseignement;
    private String culture;
    private String etat;
    private String nombreIlesAutonomes;
    private String gouvernorat;
    private String districtProvince;
    private String comte;
    private String departement;
    private String commune;
    private String prefecture;
    private String sousPrefecture;
    private String wilaya;
    private String villeIndependante;
    private String municipalite;
    private String chabiyat;
    private String cercle;
    private String village;
    private String zoneDuGouvernementLocal;
    private String circonscription;
    private String delegation;
    private String chefferie;
    private String coCapital;
    private String region;
} 