package com.gbastos.featuretoggleapi.controller;

import com.gbastos.featuretoggleapi.adapter.IAdapter;
import com.gbastos.featuretoggleapi.adapter.IPageableAdapter;
import com.gbastos.featuretoggleapi.controller.request.AssignFeatureRequest;
import com.gbastos.featuretoggleapi.controller.request.CustomerRequest;
import com.gbastos.featuretoggleapi.controller.response.CustomerFeaturesResponse;
import com.gbastos.featuretoggleapi.controller.response.CustomerResponse;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.Customer;
import com.gbastos.featuretoggleapi.service.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;

@RestController
@RequestMapping("/v1/customer")
public class CustomerController {

  private ICustomerService customerService;
  private IAdapter<Customer, CustomerRequest, CustomerResponse> customerAdapter;
  private IPageableAdapter<Customer, CustomerResponse> customerPageableAdapter;
  private IAdapter<Customer, CustomerRequest, CustomerFeaturesResponse> customerFeaturesAdapter;

  @Autowired
  public CustomerController(
      ICustomerService customerService,
      IAdapter<Customer, CustomerRequest, CustomerResponse> customerAdapter,
      IPageableAdapter<Customer, CustomerResponse> customerPageableAdapter,
      IAdapter<Customer, CustomerRequest, CustomerFeaturesResponse> customerFeaturesAdapter) {
    this.customerService = customerService;
    this.customerAdapter = customerAdapter;
    this.customerPageableAdapter = customerPageableAdapter;
    this.customerFeaturesAdapter = customerFeaturesAdapter;
  }

  @GetMapping(value = "/{customer-id}")
  public CustomerResponse findById(@PathVariable(CustomerRequest.FieldName.ID) @Min(1) int id)
      throws EntityNotFoundException {
    return customerAdapter.mapEntityToResponse(customerService.findById(id));
  }

  @PostMapping
  public void save(@RequestBody @Valid CustomerRequest request) {
    Customer entity = customerAdapter.mapRequestToEntity(request);
    customerService.save(entity);
  }

  @PostMapping(value = "/assign-feature")
  public void assignFeature(@RequestBody @Valid AssignFeatureRequest request)
      throws EntityNotFoundException {
    customerService.assignFeature(request.getCustomerId(), request.getFeatureIds());
  }

  @PutMapping(value = "/{customer-id}")
  public void update(
      @PathVariable(CustomerRequest.FieldName.ID) Integer id,
      @RequestBody @Valid CustomerRequest customerRequest)
      throws EntityNotFoundException {
    customerService.update(id, customerAdapter.mapRequestToEntity(customerRequest));
  }

  @DeleteMapping("/{customer-id}")
  public void delete(@PathVariable(CustomerRequest.FieldName.ID) Integer id)
      throws EntityNotFoundException {
    customerService.delete(id);
  }

  @GetMapping("/list")
  public Page<CustomerResponse> list(@PageableDefault(size = 10) Pageable pageable) {
    return customerPageableAdapter.mapEntityToPageableResponse(customerService.findAll(pageable));
  }

  @GetMapping(value = "/{customer-id}/features")
  public CustomerFeaturesResponse findFeaturesByCustomerId(
      @PathVariable(CustomerRequest.FieldName.ID) @Min(1) int id) throws EntityNotFoundException {
    return customerFeaturesAdapter.mapEntityToResponse(customerService.findById(id));
  }
}
