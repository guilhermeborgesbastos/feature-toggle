package com.gbastos.featuretoggleapi.service;

import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface ICustomerService {

  void save(Customer entity);

  void update(int customerId, Customer entity) throws EntityNotFoundException;

  void delete(int customerId) throws EntityNotFoundException;

  Customer findById(int customerId) throws EntityNotFoundException;

  Page<Customer> findAll(Pageable pageable);

  void assignFeature(Integer customerId, Set<Integer> featureIds) throws EntityNotFoundException;
}
