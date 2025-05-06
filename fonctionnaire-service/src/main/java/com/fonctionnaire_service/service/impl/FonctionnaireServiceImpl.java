package com.fonctionnaire_service.service.impl;

import com.fonctionnaire_service.entity.Fonctionnaire;
import com.fonctionnaire_service.repository.FonctionnaireRepository;
import com.fonctionnaire_service.service.FonctionnaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FonctionnaireServiceImpl implements FonctionnaireService {

    @Autowired
    private FonctionnaireRepository repository;

    @Override
    public Fonctionnaire save(Fonctionnaire f) {
        return repository.save(f);
    }

    @Override
    public List<Fonctionnaire> getAll() {
        return repository.findAll();
    }

    @Override
    public Fonctionnaire getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Fonctionnaire> getByEntiteId(Long entiteId) {
        return repository.findByEntiteId(entiteId);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
