package com.entite_service.controller;

import com.entite_service.entity.EntiteContact;
import com.entite_service.service.EntiteContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entites/contacts")
@RequiredArgsConstructor
public class EntiteContactController {

    @Autowired
    private EntiteContactService contactService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<EntiteContact>> getAllContacts() {
        return ResponseEntity.ok(contactService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<EntiteContact> getContactById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.findById(id));
    }

    @GetMapping("/entite/{entiteId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<EntiteContact> getContactByEntiteId(@PathVariable Long entiteId) {
        return ResponseEntity.ok(contactService.findByEntiteId(entiteId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EntiteContact> createContact(@RequestBody EntiteContact contact) {
        return new ResponseEntity<>(contactService.save(contact), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EntiteContact> updateContact(@PathVariable Long id, @RequestBody EntiteContact contact) {
        return ResponseEntity.ok(contactService.update(id, contact));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 