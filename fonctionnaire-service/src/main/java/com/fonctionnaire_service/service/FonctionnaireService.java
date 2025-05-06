package com.fonctionnaire_service.service;

import com.fonctionnaire_service.entity.Fonctionnaire;

import java.util.List;

public interface FonctionnaireService {
    Fonctionnaire save(Fonctionnaire f);
    List<Fonctionnaire> getAll();
    Fonctionnaire getById(Long id);
    List<Fonctionnaire> getByEntiteId(Long entiteId);
    void delete(Long id);
}
