package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.request.CustomerRequest;
import com.gbastos.featuretoggleapi.controller.response.CustomerResponse;
import com.gbastos.featuretoggleapi.model.Customer;
import lombok.ToString;
import org.springframework.stereotype.Component;

/**
 * It provides ways of mapping Customer Request into Customer persistence entity and Customer entity
 * into Customer response model.
 *
 * @see com.gbastos.featuretoggleapi.adapter.IAdapter
 */
@ToString
@Component
public class CustomerAdapter implements IAdapter<Customer, CustomerRequest, CustomerResponse> {

  /** {@inheritDoc} */
  @Override
  public Customer mapRequestToEntity(CustomerRequest request) {
    Customer entity = new Customer();
    entity.setId(request.getId());
    entity.setName(request.getName());
    return entity;
  }

  /** {@inheritDoc} */
  @Override
  public CustomerResponse mapEntityToResponse(Customer entity) {
    return CustomerResponse.builder().id(entity.getId()).name(entity.getName()).build();
  }
}
