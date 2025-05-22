package com.entite_service.controller;

import com.entite_service.entity.EntiteBusiness;
import com.entite_service.service.EntiteBusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entites/business")
@RequiredArgsConstructor
public class EntiteBusinessController {

    @Autowired
    private EntiteBusinessService businessService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<EntiteBusiness>> getAllBusinesses() {
        return ResponseEntity.ok(businessService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<EntiteBusiness> getBusinessById(@PathVariable Long id) {
        return ResponseEntity.ok(businessService.findById(id));
    }

    @GetMapping("/entite/{entiteId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<EntiteBusiness> getBusinessByEntiteId(@PathVariable Long entiteId) {
        return ResponseEntity.ok(businessService.findByEntiteId(entiteId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EntiteBusiness> createBusiness(@RequestBody EntiteBusiness business) {
        return new ResponseEntity<>(businessService.save(business), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EntiteBusiness> updateBusiness(@PathVariable Long id, @RequestBody EntiteBusiness business) {
        return ResponseEntity.ok(businessService.update(id, business));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBusiness(@PathVariable Long id) {
        businessService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 