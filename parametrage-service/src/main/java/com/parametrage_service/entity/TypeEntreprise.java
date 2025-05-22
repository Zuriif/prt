package com.parametrage_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "type_entreprise")
@Data
public class TypeEntreprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String status;

    // Control fields for Entite creation
    private boolean hasEntite;
    private boolean hasContact;
    private boolean hasBusiness;
    private boolean hasLocation;
    private boolean hasProducts;
    private boolean hasMedia;
    private boolean hasAdditional;

    @ElementCollection
    @CollectionTable(name = "type_entreprise_entite_fields", joinColumns = @JoinColumn(name = "type_entreprise_id"))
    @MapKeyColumn(name = "field_name")
    @Column(name = "is_selected")
    private Map<String, Boolean> entiteFields;

    @ElementCollection
    @CollectionTable(name = "type_entreprise_business_fields", joinColumns = @JoinColumn(name = "type_entreprise_id"))
    @MapKeyColumn(name = "field_name")
    @Column(name = "is_selected")
    private Map<String, Boolean> businessFields;

    @ElementCollection
    @CollectionTable(name = "type_entreprise_contact_fields", joinColumns = @JoinColumn(name = "type_entreprise_id"))
    @MapKeyColumn(name = "field_name")
    @Column(name = "is_selected")
    private Map<String, Boolean> contactFields;

    @ElementCollection
    @CollectionTable(name = "type_entreprise_products_fields", joinColumns = @JoinColumn(name = "type_entreprise_id"))
    @MapKeyColumn(name = "field_name")
    @Column(name = "is_selected")
    private Map<String, Boolean> productsFields;

    @ElementCollection
    @CollectionTable(name = "type_entreprise_media_fields", joinColumns = @JoinColumn(name = "type_entreprise_id"))
    @MapKeyColumn(name = "field_name")
    @Column(name = "is_selected")
    private Map<String, Boolean> mediaFields;

    @ElementCollection
    @CollectionTable(name = "type_entreprise_location_fields", joinColumns = @JoinColumn(name = "type_entreprise_id"))
    @MapKeyColumn(name = "field_name")
    @Column(name = "is_selected")
    private Map<String, Boolean> locationFields;

    @ElementCollection
    @CollectionTable(name = "type_entreprise_additional_fields", joinColumns = @JoinColumn(name = "type_entreprise_id"))
    @MapKeyColumn(name = "field_name")
    @Column(name = "is_selected")
    private Map<String, Boolean> additionalFields;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
