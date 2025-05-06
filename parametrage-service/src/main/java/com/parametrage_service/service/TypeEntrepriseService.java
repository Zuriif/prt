package com.parametrage_service.service;

import com.parametrage_service.entity.TypeEntreprise;
import java.util.List;

public interface TypeEntrepriseService {
    TypeEntreprise saveTypeEntreprise(TypeEntreprise typeEntreprise);
    List<TypeEntreprise> getAllTypeEntreprises();
    TypeEntreprise getTypeEntrepriseById(Long id);
    void deleteTypeEntreprise(Long id);
}
