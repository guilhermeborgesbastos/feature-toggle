package com.gbastos.featuretoggleapi.service;

import com.gbastos.featuretoggleapi.controller.request.FeatureToggleRequest;
import com.gbastos.featuretoggleapi.controller.response.FeatureResponse;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.CustomerFeatureToggle;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import com.gbastos.featuretoggleapi.model.enumerator.FeatureToggleStatusEnum;
import com.gbastos.featuretoggleapi.repository.CustomerFeatureToggleRepository;
import com.gbastos.featuretoggleapi.repository.FeatureToggleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FeatureToggleService implements IFeatureToggleService {

  private final FeatureToggleRepository featureToggleRepository;
  private final CustomerFeatureToggleRepository customerFeatureToggleRepository;

  @Autowired
  public FeatureToggleService(
      FeatureToggleRepository featureTogglerepository,
      CustomerFeatureToggleRepository customerFeatureToggleRepository) {
    this.featureToggleRepository = featureTogglerepository;
    this.customerFeatureToggleRepository = customerFeatureToggleRepository;
  }

  private FeatureToggle mapRequestToEntity(FeatureToggleRequest request, FeatureToggle entity) {
    entity.setDisplayName(request.getDisplayName());
    entity.setTechnicalName(request.getTechnicalName());
    entity.setDescription(request.getDescription());
    entity.setInverted(request.getInverted());
    entity.setExpiresOn(request.getExpiresOn());
    return entity;
  }

  @Override
  public FeatureToggle findById(int id) throws EntityNotFoundException {
    Optional<FeatureToggle> optionalEntity = featureToggleRepository.findById(id);

    if (optionalEntity.isPresent()) {
      return optionalEntity.get();
    }

    throw new EntityNotFoundException(
        FeatureToggle.class, FeatureToggleRequest.FieldName.ID, String.valueOf(id));
  }

  @Override
  public Page<FeatureToggle> findAll(Pageable pageable) {
    return featureToggleRepository.findAll(pageable);
  }

  @Override
  public void save(FeatureToggle entity) {
    featureToggleRepository.save(entity);
  }

  @Override
  public void update(int id, FeatureToggleRequest request) throws EntityNotFoundException {
    Optional<FeatureToggle> optionalEntity = featureToggleRepository.findById(id);

    if (optionalEntity.isPresent()) {
      featureToggleRepository.save(mapRequestToEntity(request, optionalEntity.get()));
    } else {
      throw new EntityNotFoundException(
          FeatureToggle.class, FeatureToggleRequest.FieldName.ID, String.valueOf(id));
    }
  }

  @Override
  public void delete(int id) throws EntityNotFoundException {
    Optional<FeatureToggle> optionalEntity = featureToggleRepository.findById(id);

    if (optionalEntity.isPresent()) {
      featureToggleRepository.delete(optionalEntity.get());
    } else {
      throw new EntityNotFoundException(
          FeatureToggle.class, FeatureToggleRequest.FieldName.ID, String.valueOf(id));
    }
  }

  @Override
  public void archiveById(int featureId, int customerId) throws EntityNotFoundException {
    Optional<FeatureToggle> optionalFeatureEntity = featureToggleRepository.findById(featureId);

    if (optionalFeatureEntity.isPresent()) {
      // Does the Feature Toggle exists? If so.
      // Fetches the 'node' that ties the feature with its customer in order to archive it.
      Integer featureToggleId = optionalFeatureEntity.get().getId();
      CustomerFeatureToggle customerFeatureToggleEntity =
          customerFeatureToggleRepository
              .fetchCustomerFeatureToggleByCustomerAndFeature(customerId, featureToggleId)
              .orElseThrow(() -> new EntityNotFoundException(FeatureResponse.class));

      // It does the persistence just in case of the feature for that specific customer is archived.
      if (FeatureToggleStatusEnum.ENABLED.equals(customerFeatureToggleEntity.getStatus())) {
        customerFeatureToggleEntity.setStatus(FeatureToggleStatusEnum.ARCHIVED);
        customerFeatureToggleRepository.save(customerFeatureToggleEntity);
      }
    } else {
      throw new EntityNotFoundException(
          FeatureToggle.class, FeatureToggleRequest.FieldName.ID, String.valueOf(featureId));
    }
  }

  @Override
  public void enableById(int featureId, int customerId) throws EntityNotFoundException {
    Optional<FeatureToggle> optionalFeatureEntity = featureToggleRepository.findById(featureId);

    if (optionalFeatureEntity.isPresent()) {
      // Does the Feature Toggle exists? If so.
      // Fetches the 'node' that ties the feature with its customer in order to enable it.
      Integer featureToggleId = optionalFeatureEntity.get().getId();
      CustomerFeatureToggle customerFeatureToggleEntity =
          customerFeatureToggleRepository
              .fetchCustomerFeatureToggleByCustomerAndFeature(customerId, featureToggleId)
              .orElseThrow(() -> new EntityNotFoundException(FeatureResponse.class));

      // It does the persistence just in case of the feature for that specific customer is archived.
      if (FeatureToggleStatusEnum.ARCHIVED.equals(customerFeatureToggleEntity.getStatus())) {
        customerFeatureToggleEntity.setStatus(FeatureToggleStatusEnum.ENABLED);
        customerFeatureToggleRepository.save(customerFeatureToggleEntity);
      }
    } else {
      throw new EntityNotFoundException(
          FeatureToggle.class, FeatureToggleRequest.FieldName.ID, String.valueOf(featureId));
    }
  }
}
