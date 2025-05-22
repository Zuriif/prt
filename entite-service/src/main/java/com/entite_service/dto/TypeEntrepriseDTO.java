package com.entite_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TypeEntrepriseDTO {
    private Long id;
    private String nom;
    private String description;
    private String type;
    private String status;
    
    // Control fields for Entite creation
    private boolean hasContact;
    private boolean hasBusiness;
    private boolean hasLocation;
    private boolean hasProducts;
    private boolean hasMedia;
    private boolean hasAdditional;
    private boolean hasEntite;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 