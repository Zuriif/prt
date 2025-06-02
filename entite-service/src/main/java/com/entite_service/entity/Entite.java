package com.entite_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "entity")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Entite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String libelle;
    private String numMB;
    private String description;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "type_entreprise_id")
    private Long typeEntrepriseId;
    
    private String type;
    private String SH;
    private Integer risk;
    private Integer tome;
    private String textSeo;
    private String region;
    private String standard;
    private String logo;
    private String pays;
    private String telephone;
    private String codeFiscal;
    private String ice;
    private String patente;
    private String rc;
    private String cnss;
    private String slug;
    private String metaTitle;
    private String metaDescription;
    private String titreAriane;
    private String langueSite;

    @OneToOne(mappedBy = "entite", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private EntiteBusiness entiteBusiness;

    @OneToOne(mappedBy = "entite", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private EntiteContact entiteContact;

    @OneToOne(mappedBy = "entite", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private EntiteProducts entiteProducts;

    @OneToOne(mappedBy = "entite", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private EntiteMedia entiteMedia;

    @OneToOne(mappedBy = "entite", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private EntiteLocation entiteLocation;

    @OneToOne(mappedBy = "entite", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private EntiteAdditional entiteAdditional;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
