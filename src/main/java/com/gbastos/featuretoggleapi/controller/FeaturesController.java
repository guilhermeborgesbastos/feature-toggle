package com.gbastos.featuretoggleapi.controller;

import com.gbastos.featuretoggleapi.adapter.IAdapter;
import com.gbastos.featuretoggleapi.controller.request.CustomerRequest;
import com.gbastos.featuretoggleapi.controller.response.CustomerFeaturesResponse;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.Customer;
import com.gbastos.featuretoggleapi.service.ICustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Min;

@RestController
@RequestMapping("/v1/features")
public class FeaturesController {

    private ICustomerService customerService;
    private IAdapter<Customer, CustomerRequest, CustomerFeaturesResponse> customerFeaturesAdapter;

    @Autowired
    public FeaturesController(
            ICustomerService customerService,
            IAdapter<Customer, CustomerRequest, CustomerFeaturesResponse> customerFeaturesAdapter) {
        this.customerService = customerService;
        this.customerFeaturesAdapter = customerFeaturesAdapter;
    }

    @GetMapping(value = "/customer/{customer-id}")
    public CustomerFeaturesResponse findFeaturesByCustomerId(
            @PathVariable(CustomerRequest.FieldName.ID) @Min(1) int id) throws EntityNotFoundException {
        return customerFeaturesAdapter.mapEntityToResponse(customerService.findById(id));
    }
}
