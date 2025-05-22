package com.entite_service.controller;

import com.entite_service.entity.EntiteLocation;
import com.entite_service.service.EntiteLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entite-location")
public class EntiteLocationController {

    @Autowired
    private EntiteLocationService entiteLocationService;

    @GetMapping
    public List<EntiteLocation> getAllEntiteLocation() {
        return entiteLocationService.findAll();
    }

    @GetMapping("/{id}")
    public EntiteLocation getEntiteLocationById(@PathVariable Long id) {
        return entiteLocationService.findById(id);
    }

    @GetMapping("/entite/{entiteId}")
    public EntiteLocation getEntiteLocationByEntiteId(@PathVariable Long entiteId) {
        return entiteLocationService.findByEntiteId(entiteId);
    }

    @PostMapping
    public EntiteLocation createEntiteLocation(@RequestBody EntiteLocation entiteLocation) {
        return entiteLocationService.save(entiteLocation);
    }

    @PutMapping("/{id}")
    public EntiteLocation updateEntiteLocation(@PathVariable Long id, @RequestBody EntiteLocation entiteLocation) {
        return entiteLocationService.update(id, entiteLocation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntiteLocation(@PathVariable Long id) {
        entiteLocationService.deleteById(id);
        return ResponseEntity.ok().build();
    }
} 