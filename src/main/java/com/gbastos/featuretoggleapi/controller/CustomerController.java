package com.gbastos.featuretoggleapi.controller;

import com.gbastos.featuretoggleapi.adapter.IAdapter;
import com.gbastos.featuretoggleapi.adapter.IPageableAdapter;
import com.gbastos.featuretoggleapi.controller.request.AssignFeatureRequest;
import com.gbastos.featuretoggleapi.controller.request.CustomerPartialRequest;
import com.gbastos.featuretoggleapi.controller.request.CustomerRequest;
import com.gbastos.featuretoggleapi.controller.request.FeatureToggleRequest;
import com.gbastos.featuretoggleapi.controller.response.CustomerResponse;
import com.gbastos.featuretoggleapi.controller.response.FeatureToggleResponse;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.Customer;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import com.gbastos.featuretoggleapi.service.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/customer")
public class CustomerController {

  private ICustomerService customerService;
  private IAdapter<Customer, CustomerRequest, CustomerResponse> customerAdapter;
  private IPageableAdapter<Customer, CustomerResponse> customerPageableAdapter;
  private IAdapter<FeatureToggle, FeatureToggleRequest, FeatureToggleResponse> featureToggleAdapter;

  @Autowired
  public CustomerController(
      ICustomerService customerService,
      IAdapter<Customer, CustomerRequest, CustomerResponse> customerAdapter,
      IPageableAdapter<Customer, CustomerResponse> customerPageableAdapter,
      IAdapter<FeatureToggle, FeatureToggleRequest, FeatureToggleResponse> featureToggleAdapter) {
    this.customerService = customerService;
    this.customerAdapter = customerAdapter;
    this.customerPageableAdapter = customerPageableAdapter;
    this.featureToggleAdapter = featureToggleAdapter;
  }

  private FeatureToggleResponse mapToFeatureToggleResponse(
          FeatureToggle feature) {
    return FeatureToggleResponse.builder()
            .id(feature.getId())
            .displayName(feature.getDisplayName())
            .technicalName(feature.getTechnicalName())
            .expiresOn(feature.getExpiresOn())
            .description(feature.getDescription())
            .inverted(feature.getInverted())
            .build();
  }

  private List<FeatureToggleResponse> mapEntityToResponse(Customer entity) {
    return entity.getCustomerFeatureToggles().stream()
            .map(customerFeatureToggle -> mapToFeatureToggleResponse(customerFeatureToggle.getFeatureToggle()))
            .collect(Collectors.toList());
  }

  @GetMapping(value = "/{customer-id}")
  public CustomerResponse findById(@PathVariable(CustomerRequest.FieldName.ID) @Min(1) int id)
      throws EntityNotFoundException {
    return customerAdapter.mapEntityToResponse(customerService.findById(id));
  }

  @PostMapping
  public void save(@RequestBody @Valid CustomerRequest request) throws EntityNotFoundException {
    customerService.save(customerAdapter.mapRequestToEntity(request), request.getFeatureIds());
  }

  @PostMapping(value = "/assign-feature")
  public void assignFeature(@RequestBody @Valid AssignFeatureRequest request)
      throws EntityNotFoundException {
    customerService.assignFeature(request.getCustomerId(), request.getFeatureIds());
  }

  @PutMapping(value = "/{customer-id}")
  public void update(
      @PathVariable(CustomerPartialRequest.FieldName.ID) Integer id,
      @RequestBody @Valid CustomerPartialRequest customerPartialRequest)
      throws EntityNotFoundException {
    customerService.update(id, customerPartialRequest);
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
  public List<FeatureToggleResponse> findFeatures(
      @PathVariable(CustomerRequest.FieldName.ID) @Min(1) int id) throws EntityNotFoundException {
    return mapEntityToResponse(customerService.findById(id));
  }
}
