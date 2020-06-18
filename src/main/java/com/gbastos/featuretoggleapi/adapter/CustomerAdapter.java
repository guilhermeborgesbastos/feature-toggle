package com.gbastos.featuretoggleapi.adapter;

import com.gbastos.featuretoggleapi.controller.request.CustomerRequest;
import com.gbastos.featuretoggleapi.controller.response.CustomerResponse;
import com.gbastos.featuretoggleapi.model.Customer;
import lombok.ToString;
import org.springframework.stereotype.Component;

@ToString
@Component
public class CustomerAdapter implements IAdapter<Customer, CustomerRequest, CustomerResponse> {

  @Override
  public Customer mapRequestToEntity(CustomerRequest request) {
    Customer entity = new Customer();
    entity.setId(request.getId());
    entity.setName(request.getName());
    return entity;
  }

  @Override
  public CustomerResponse mapEntityToResponse(Customer dbModel) {
    return CustomerResponse.builder().id(dbModel.getId()).name(dbModel.getName()).build();
  }
}
