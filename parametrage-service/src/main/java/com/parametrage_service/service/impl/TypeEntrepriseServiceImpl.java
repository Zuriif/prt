package com.parametrage_service.service.impl;

import com.parametrage_service.entity.TypeEntreprise;
import com.parametrage_service.repository.TypeEntrepriseRepository;
import com.parametrage_service.service.TypeEntrepriseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TypeEntrepriseServiceImpl implements TypeEntrepriseService {

    @Autowired
    private TypeEntrepriseRepository typeEntrepriseRepository;

    @Override
    public TypeEntreprise saveTypeEntreprise(TypeEntreprise typeEntreprise) {
        return typeEntrepriseRepository.save(typeEntreprise);
    }

    @Override
    public List<TypeEntreprise> getAllTypeEntreprises() {
        return typeEntrepriseRepository.findAll();
    }

    @Override
    public TypeEntreprise getTypeEntrepriseById(Long id) {
        return typeEntrepriseRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteTypeEntreprise(Long id) {
        typeEntrepriseRepository.deleteById(id);
    }
}
