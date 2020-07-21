package com.gbastos.featuretoggleapi.controller;

import com.gbastos.featuretoggleapi.adapter.ICollectionAdapter;
import com.gbastos.featuretoggleapi.controller.request.FeaturesRequest;
import com.gbastos.featuretoggleapi.controller.response.FeaturesResponse;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import com.gbastos.featuretoggleapi.service.IFeatureToggleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/v1/features")
public class FeaturesController {

    private IFeatureToggleService featureToggleService;
    private ICollectionAdapter<FeatureToggle, FeaturesRequest, FeaturesResponse> featuresAdapter;

    @Autowired
    public FeaturesController(
            IFeatureToggleService featureToggleService,
            ICollectionAdapter<FeatureToggle, FeaturesRequest, FeaturesResponse> featuresAdapter) {
        this.featureToggleService = featureToggleService;
        this.featuresAdapter = featuresAdapter;
    }

    @PostMapping
    public FeaturesResponse findFeatures(@RequestBody @Valid FeaturesRequest request) {
        return featuresAdapter.mapEntityToResponse(
                featureToggleService.findFeatures(request.getCustomerId(), request.getFeatureIds()));
    }
}
