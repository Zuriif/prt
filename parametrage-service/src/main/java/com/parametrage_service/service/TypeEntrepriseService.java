package com.parametrage_service.service;

import com.parametrage_service.entity.TypeEntreprise;
import java.util.List;
import java.util.Optional;

public interface TypeEntrepriseService {
    List<TypeEntreprise> getAllTypeEntreprises();
    Optional<TypeEntreprise> getTypeEntrepriseById(Long id);
    TypeEntreprise createTypeEntreprise(TypeEntreprise typeEntreprise);
    TypeEntreprise updateTypeEntreprise(Long id, TypeEntreprise typeEntreprise);
    void deleteTypeEntreprise(Long id);
}
