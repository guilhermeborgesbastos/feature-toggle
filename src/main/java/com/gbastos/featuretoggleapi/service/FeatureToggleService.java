package com.gbastos.featuretoggleapi.service;

import com.gbastos.featuretoggleapi.controller.request.FeatureTogglePartialRequest;
import com.gbastos.featuretoggleapi.controller.request.FeatureToggleRequest;
import com.gbastos.featuretoggleapi.controller.response.FeatureResponse;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.Customer;
import com.gbastos.featuretoggleapi.model.CustomerFeatureToggle;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import com.gbastos.featuretoggleapi.model.enumerator.FeatureToggleStatusEnum;
import com.gbastos.featuretoggleapi.repository.CustomerFeatureToggleRepository;
import com.gbastos.featuretoggleapi.repository.CustomerRepository;
import com.gbastos.featuretoggleapi.repository.FeatureToggleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class FeatureToggleService implements IFeatureToggleService {

  private FeatureToggleRepository featureToggleRepository;
  private CustomerFeatureToggleRepository customerFeatureToggleRepository;
  private CustomerRepository customerRepository;

  @Autowired
  public FeatureToggleService(
      FeatureToggleRepository featureTogglerepository,
      CustomerFeatureToggleRepository customerFeatureToggleRepository,
      CustomerRepository customerRepository) {
    this.featureToggleRepository = featureTogglerepository;
    this.customerFeatureToggleRepository = customerFeatureToggleRepository;
    this.customerRepository = customerRepository;
  }

  private FeatureToggle mapRequestToEntity(FeatureTogglePartialRequest request, FeatureToggle entity) {
    if(request.getDisplayName() != null) {
      entity.setDisplayName(request.getDisplayName());
    }
    if (request.getTechnicalName() != null) {
      entity.setTechnicalName(request.getTechnicalName());
    }
    if (request.getDescription() != null) {
      entity.setDescription(request.getDescription());
    }
    if (request.getInverted() != null) {
      entity.setInverted(request.getInverted());
    }
    if (request.getExpiresOn() != null) {
      entity.setExpiresOn(request.getExpiresOn());
    }
    return entity;
  }

  private void updateCustomerFeatures(Set<Integer> customerIds, FeatureToggle entity) {
    // It drops the previous relationships in order to add new ones.
    customerFeatureToggleRepository.deleteByFeatureToggleId(entity.getId());
    // It creates the relationships between the feature and their customers.
    List<CustomerFeatureToggle> customerFeatureToggles = new ArrayList<>();
    List<Customer> customers = customerRepository.findAllById(customerIds);
    customers.forEach(
        customer ->
            customerFeatureToggles.add(
                new CustomerFeatureToggle(customer, entity, FeatureToggleStatusEnum.ENABLED)));
    customerFeatureToggleRepository.saveAll(customerFeatureToggles);
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
  public Page<FeatureToggle> listAll(Pageable pageable) {
    return featureToggleRepository.findAll(pageable);
  }

  @Override
  public void save(FeatureToggle entity, Set<Integer> customerIds) {
    FeatureToggle savedEntity = featureToggleRepository.save(entity);
    // In case of the intent to associate the created feature with the customer(s)
    if (customerIds != null && customerIds.size() > 0) {
      updateCustomerFeatures(customerIds, savedEntity);
    }
  }

  @Override
  public void update(int id, FeatureTogglePartialRequest request) throws EntityNotFoundException {
    Optional<FeatureToggle> optionalEntity = featureToggleRepository.findById(id);

    if (optionalEntity.isPresent()) {
      FeatureToggle updatedEntity = featureToggleRepository.save(mapRequestToEntity(request, optionalEntity.get()));

      // In case of the intent to associate the updated feature with the customer(s).
      Set<Integer> customerIds = request.getCustomerIds();
      if (customerIds != null && customerIds.size() > 0) {
        updateCustomerFeatures(customerIds, updatedEntity);
      }
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
