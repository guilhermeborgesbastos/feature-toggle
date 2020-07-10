package com.gbastos.featuretoggleapi.service;

import com.gbastos.featuretoggleapi.controller.request.CustomerPartialRequest;
import com.gbastos.featuretoggleapi.controller.request.CustomerRequest;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.Customer;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import com.gbastos.featuretoggleapi.repository.CustomerFeatureToggleRepository;
import com.gbastos.featuretoggleapi.repository.CustomerRepository;
import com.gbastos.featuretoggleapi.repository.FeatureToggleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomerService implements ICustomerService {

  private CustomerRepository customerRepository;
  private FeatureToggleRepository featureToggleRepository;
  private CustomerFeatureToggleRepository customerFeatureToggleRepository;

  @Autowired
  public CustomerService(
      CustomerRepository repository,
      FeatureToggleRepository featureToggleRepository,
      CustomerFeatureToggleRepository customerFeatureToggleRepository) {
    this.customerRepository = repository;
    this.featureToggleRepository = featureToggleRepository;
    this.customerFeatureToggleRepository = customerFeatureToggleRepository;
  }

  @Override
  public Customer findById(int id) throws EntityNotFoundException {
    Optional<Customer> optionalEntity = customerRepository.findById(id);

    if (optionalEntity.isPresent()) {
      return optionalEntity.get();
    }

    throw new EntityNotFoundException(
        Customer.class, CustomerRequest.FieldName.ID, String.valueOf(id));
  }

  @Override
  public Page<Customer> findAll(Pageable pageable) {
    return customerRepository.findAll(pageable);
  }

  @Override
  public void assignFeature(Integer customerId, Set<Integer> featureIds)
      throws EntityNotFoundException {
    Customer customer = findById(customerId);
    List<FeatureToggle> featureToggles = featureToggleRepository.findAllById(featureIds);
    featureToggles.forEach(featureToggle -> customer.addFeatureToggle(featureToggle));
    customerRepository.save(customer);
  }

  @Override
  public void save(Customer entity, Set<Integer> featureIds) throws EntityNotFoundException {
    Customer savedEntity = customerRepository.save(entity);
    // In case of the intent to associate the created customer with the feature(s)
    if (featureIds != null && featureIds.size() > 0) {
      assignFeature(savedEntity.getId(), featureIds);
    }
  }

  /**
   * It updates the customer properties and its associated features by adding and/or removing them.
   *
   * @param id the customer's entity unique identifier
   * @param request the customer partial request model.
   * @throws EntityNotFoundException
   */
  @Override
  public void update(int id, CustomerPartialRequest request) throws EntityNotFoundException {
    Optional<Customer> optionalEntity = customerRepository.findById(id);

    if (optionalEntity.isPresent()) {
      // It sets the ordinary property
      Customer entity = optionalEntity.get();
      entity.setName(request.getName());

      // In case of the intent of changing the customer's feature(s).
      Set<Integer> featureIds = request.getFeatureIds();
      if (featureIds != null) {
        // It stores the original feature IDs associated to the customer for further comparisons.
        List<Integer> currentFeatureIds = entity.getCustomerFeatureToggles()
                .stream()
                .map(customerFeatureToggle -> customerFeatureToggle.getFeatureToggle().getId())
                .collect(Collectors.toList());

        // It removes all feature(s) that was/were unassigned from the customer.
        List<Integer> removalFeatureIds = new ArrayList<>(currentFeatureIds);
        // In case of a deletion of ALL the features or in case of removal of one or many features.
        if (currentFeatureIds.size() > 0 && featureIds.size() == 0 ||
            removalFeatureIds.removeAll(featureIds) && removalFeatureIds.size() > 0) {
          List<FeatureToggle> featureTogglesForRemoval =
              featureToggleRepository.findAllById(removalFeatureIds);
          featureTogglesForRemoval.forEach(
              featureToggle -> entity.removeFeatureToggle(featureToggle));
        }

        // It only include the remaining features that are not already assigned to the customer.
        featureIds.removeAll(currentFeatureIds);
        if(featureIds.size() > 0) {
          List<FeatureToggle> featureTogglesToInsertion = featureToggleRepository.findAllById(featureIds);
          featureTogglesToInsertion.forEach(featureToggle -> entity.addFeatureToggle(featureToggle));
        }
      }
      customerRepository.save(entity);
    } else {
      throw new EntityNotFoundException(
          Customer.class, CustomerRequest.FieldName.ID, String.valueOf(id));
    }
  }

  @Override
  public void delete(int id) throws EntityNotFoundException {
    Optional<Customer> optionalEntity = customerRepository.findById(id);

    if (optionalEntity.isPresent()) {
      customerRepository.delete(optionalEntity.get());
    } else {
      throw new EntityNotFoundException(
          Customer.class, CustomerRequest.FieldName.ID, String.valueOf(id));
    }
  }
}
