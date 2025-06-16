package com.entite_service.dto;

import com.entite_service.entity.*;

import lombok.Data;

@Data
public class EntiteFullDTO {

    private Long id;
    private String libelle;
    private String numMB;
    private String description;
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
    private Long secteurId;
    private Long sousSecteurId;


    private EntiteBusiness entiteBusiness;
    private EntiteContact entiteContact;
    private EntiteProducts entiteProducts;
    private EntiteMedia entiteMedia;
    private EntiteLocation entiteLocation;
    private EntiteAdditional entiteAdditional;
}
