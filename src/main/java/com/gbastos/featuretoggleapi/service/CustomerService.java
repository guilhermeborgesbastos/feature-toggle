package com.gbastos.featuretoggleapi.service;

import com.gbastos.featuretoggleapi.controller.request.CustomerRequest;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.Customer;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import com.gbastos.featuretoggleapi.repository.CustomerRepository;
import com.gbastos.featuretoggleapi.repository.FeatureToggleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class CustomerService implements ICustomerService {

  private CustomerRepository customerRepository;
  private FeatureToggleRepository featureToggleRepository;

  @Autowired
  public CustomerService(
      CustomerRepository repository, FeatureToggleRepository featureToggleRepository) {
    this.customerRepository = repository;
    this.featureToggleRepository = featureToggleRepository;
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
    save(customer);
  }

  @Override
  public void save(Customer entity) {
    customerRepository.save(entity);
  }

  @Override
  public void update(int id, Customer request) throws EntityNotFoundException {
    Optional<Customer> optionalEntity = customerRepository.findById(id);

    if (optionalEntity.isPresent()) {
      Customer entity = optionalEntity.get();
      entity.setName(request.getName());
      customerRepository.save(optionalEntity.get());
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
