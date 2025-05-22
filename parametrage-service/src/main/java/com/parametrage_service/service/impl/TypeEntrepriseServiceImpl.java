package com.parametrage_service.service.impl;

import com.parametrage_service.entity.TypeEntreprise;
import com.parametrage_service.repository.TypeEntrepriseRepository;
import com.parametrage_service.service.TypeEntrepriseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TypeEntrepriseServiceImpl implements TypeEntrepriseService {

    @Autowired
    private TypeEntrepriseRepository typeEntrepriseRepository;

    @Override
    public List<TypeEntreprise> getAllTypeEntreprises() {
        return typeEntrepriseRepository.findAll();
    }

    @Override
    public Optional<TypeEntreprise> getTypeEntrepriseById(Long id) {
        return typeEntrepriseRepository.findById(id);
    }

    @Override
    public TypeEntreprise createTypeEntreprise(TypeEntreprise typeEntreprise) {
        return typeEntrepriseRepository.save(typeEntreprise);
    }

    @Override
    public TypeEntreprise updateTypeEntreprise(Long id, TypeEntreprise typeEntreprise) {
        if (typeEntrepriseRepository.existsById(id)) {
            typeEntreprise.setId(id);
            return typeEntrepriseRepository.save(typeEntreprise);
        }
        throw new RuntimeException("TypeEntreprise not found with id: " + id);
    }

    @Override
    public void deleteTypeEntreprise(Long id) {
        typeEntrepriseRepository.deleteById(id);
    }
}
