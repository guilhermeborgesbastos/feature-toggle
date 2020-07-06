package com.gbastos.featuretoggleapi.controller;

import com.gbastos.featuretoggleapi.adapter.IAdapter;
import com.gbastos.featuretoggleapi.adapter.IPageableAdapter;
import com.gbastos.featuretoggleapi.controller.request.CustomerRequest;
import com.gbastos.featuretoggleapi.controller.request.FeatureTogglePartialRequest;
import com.gbastos.featuretoggleapi.controller.request.FeatureToggleRequest;
import com.gbastos.featuretoggleapi.controller.response.CustomerResponse;
import com.gbastos.featuretoggleapi.controller.response.FeatureToggleResponse;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.Customer;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import com.gbastos.featuretoggleapi.service.IFeatureToggleService;
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
@RequestMapping("/v1/feature")
public class FeatureController {

  private IFeatureToggleService featureToggleService;
  private IAdapter<FeatureToggle, FeatureToggleRequest, FeatureToggleResponse> featureToggleAdapter;
  private IPageableAdapter<FeatureToggle, FeatureToggleResponse> featureTogglePageableAdapter;
  private IAdapter<Customer, CustomerRequest, CustomerResponse> customerAdapter;

  @Autowired
  public FeatureController(
          IFeatureToggleService featureToggleService,
          IAdapter<FeatureToggle, FeatureToggleRequest, FeatureToggleResponse> featureToggleAdapter,
          IPageableAdapter<FeatureToggle, FeatureToggleResponse> featureTogglePageableAdapter,
          IAdapter<Customer, CustomerRequest, CustomerResponse> customerAdapter) {
    this.featureToggleService = featureToggleService;
    this.featureToggleAdapter = featureToggleAdapter;
    this.featureTogglePageableAdapter = featureTogglePageableAdapter;
    this.customerAdapter = customerAdapter;
  }

  private List<CustomerResponse> mapEntityToResponse(FeatureToggle entity) {
    return entity.getCustomerFeatureToggles().stream()
        .map(
            customerFeatureToggle ->
                customerAdapter.mapEntityToResponse(customerFeatureToggle.getCustomer()))
        .collect(Collectors.toList());
  }

  @GetMapping(value = "/{feature-toggle-id}")
  public FeatureToggleResponse findById(
      @PathVariable(FeatureToggleRequest.FieldName.ID) @Min(1) int id)
      throws EntityNotFoundException {
    return featureToggleAdapter.mapEntityToResponse(featureToggleService.findById(id));
  }

  @PostMapping
  public void create(@RequestBody @Valid FeatureToggleRequest request) {
    FeatureToggle entity = featureToggleAdapter.mapRequestToEntity(request);
    featureToggleService.save(entity, request.getCustomerIds());
  }

  @PutMapping(value = "/{feature-toggle-id}")
  public void update(
      @PathVariable(FeatureTogglePartialRequest.FieldName.ID) Integer id,
      @RequestBody @Valid FeatureTogglePartialRequest request)
      throws EntityNotFoundException {
    featureToggleService.update(id, request);
  }

  @GetMapping("/list")
  public Page<FeatureToggleResponse> list(@PageableDefault(size = 10) Pageable pageable) {
    return featureTogglePageableAdapter.mapEntityToPageableResponse(
        featureToggleService.listAll(pageable));
  }

  @DeleteMapping("/{feature-toggle-id}")
  public void delete(@PathVariable(FeatureToggleRequest.FieldName.ID) Integer id)
      throws EntityNotFoundException {
    featureToggleService.delete(id);
  }

  @PatchMapping(value = "/archive/{feature-toggle-id}/customer/{customer-id}")
  public void archiveById(
      @PathVariable(FeatureToggleRequest.FieldName.ID) @Min(1) int featureId,
      @PathVariable(CustomerRequest.FieldName.ID) Integer customerId)
      throws EntityNotFoundException {
    featureToggleService.archiveById(featureId, customerId);
  }

  @PatchMapping(value = "/enable/{feature-toggle-id}/customer/{customer-id}")
  public void enableById(
      @PathVariable(FeatureToggleRequest.FieldName.ID) @Min(1) int featureId,
      @PathVariable(CustomerRequest.FieldName.ID) Integer customerId)
      throws EntityNotFoundException {
    featureToggleService.enableById(featureId, customerId);
  }

  @GetMapping(value = "/{feature-toggle-id}/customers")
  public List<CustomerResponse> findCustomersByFeatureId(
          @PathVariable(FeatureToggleRequest.FieldName.ID) @Min(1) int id) throws EntityNotFoundException {
    return mapEntityToResponse(featureToggleService.findById(id));
  }
}
