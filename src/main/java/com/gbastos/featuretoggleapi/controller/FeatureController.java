package com.gbastos.featuretoggleapi.controller;

import com.gbastos.featuretoggleapi.adapter.IAdapter;
import com.gbastos.featuretoggleapi.adapter.IPageableAdapter;
import com.gbastos.featuretoggleapi.controller.request.CustomerRequest;
import com.gbastos.featuretoggleapi.controller.request.FeatureToggleRequest;
import com.gbastos.featuretoggleapi.controller.response.FeatureToggleResponse;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import com.gbastos.featuretoggleapi.service.IFeatureToggleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;

@RestController
@RequestMapping("/v1/feature")
public class FeatureController {

  private IFeatureToggleService featureToggleService;

  private IAdapter<FeatureToggle, FeatureToggleRequest, FeatureToggleResponse> featureToggleAdapter;
  private IPageableAdapter<FeatureToggle, FeatureToggleResponse> featureTogglePageableAdapter;

  @Autowired
  public FeatureController(
      IFeatureToggleService featureToggleService,
      IAdapter<FeatureToggle, FeatureToggleRequest, FeatureToggleResponse> featureToggleAdapter,
      IPageableAdapter<FeatureToggle, FeatureToggleResponse> featureTogglePageableAdapter) {
    this.featureToggleService = featureToggleService;
    this.featureToggleAdapter = featureToggleAdapter;
    this.featureTogglePageableAdapter = featureTogglePageableAdapter;
  }

  @GetMapping(value = "/{feature-toggle-id}")
  public FeatureToggleResponse findById(
      @PathVariable(FeatureToggleRequest.FieldName.ID) @Min(1) int id)
      throws EntityNotFoundException {
    return featureToggleAdapter.mapEntityToResponse(featureToggleService.findById(id));
  }

  @PostMapping
  public void save(@RequestBody @Valid FeatureToggleRequest request) {
    FeatureToggle entity = featureToggleAdapter.mapRequestToEntity(request);
    featureToggleService.save(entity, request.getCustomerIds());
  }

  @PutMapping(value = "/{feature-toggle-id}")
  public void update(
      @PathVariable(FeatureToggleRequest.FieldName.ID) Integer id,
      @RequestBody @Valid FeatureToggleRequest request)
      throws EntityNotFoundException {
    featureToggleService.update(id, request);
  }

  @GetMapping("/listAll")
  Page<FeatureToggleResponse> listAll(@PageableDefault(size = 10) Pageable pageable) {
    return featureTogglePageableAdapter.mapEntityToPageableResponse(
        featureToggleService.findAll(pageable));
  }

  @DeleteMapping("/{feature-toggle-id}")
  void delete(@PathVariable(FeatureToggleRequest.FieldName.ID) Integer id)
      throws EntityNotFoundException {
    featureToggleService.delete(id);
  }

  @PatchMapping(value = "/archive/{feature-toggle-id}/customer/{customerId}")
  public void archiveById(
      @PathVariable(FeatureToggleRequest.FieldName.ID) @Min(1) int featureId,
      @PathVariable(CustomerRequest.FieldName.ID) Integer customerId)
      throws EntityNotFoundException {
    featureToggleService.archiveById(featureId, customerId);
  }

  @PatchMapping(value = "/enable/{feature-toggle-id}/customer/{customerId}")
  public void enableById(
      @PathVariable(FeatureToggleRequest.FieldName.ID) @Min(1) int featureId,
      @PathVariable(CustomerRequest.FieldName.ID) Integer customerId)
      throws EntityNotFoundException {
    featureToggleService.enableById(featureId, customerId);
  }
}
