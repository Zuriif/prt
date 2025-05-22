package com.entite_service.controller;

import com.entite_service.entity.EntiteAdditional;
import com.entite_service.service.EntiteAdditionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entite-additional")
public class EntiteAdditionalController {

    @Autowired
    private EntiteAdditionalService entiteAdditionalService;

    @GetMapping
    public List<EntiteAdditional> getAllEntiteAdditional() {
        return entiteAdditionalService.findAll();
    }

    @GetMapping("/{id}")
    public EntiteAdditional getEntiteAdditionalById(@PathVariable Long id) {
        return entiteAdditionalService.findById(id);
    }

    @GetMapping("/entite/{entiteId}")
    public EntiteAdditional getEntiteAdditionalByEntiteId(@PathVariable Long entiteId) {
        return entiteAdditionalService.findByEntiteId(entiteId);
    }

    @PostMapping
    public EntiteAdditional createEntiteAdditional(@RequestBody EntiteAdditional entiteAdditional) {
        return entiteAdditionalService.save(entiteAdditional);
    }

    @PutMapping("/{id}")
    public EntiteAdditional updateEntiteAdditional(@PathVariable Long id, @RequestBody EntiteAdditional entiteAdditional) {
        return entiteAdditionalService.update(id, entiteAdditional);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntiteAdditional(@PathVariable Long id) {
        entiteAdditionalService.deleteById(id);
        return ResponseEntity.ok().build();
    }
} 