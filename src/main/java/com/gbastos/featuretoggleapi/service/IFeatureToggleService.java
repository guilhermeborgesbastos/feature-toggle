package com.gbastos.featuretoggleapi.service;

import com.gbastos.featuretoggleapi.controller.request.FeatureTogglePartialRequest;
import com.gbastos.featuretoggleapi.controller.request.FeatureToggleRequest;
import com.gbastos.featuretoggleapi.exception.EntityNotFoundException;
import com.gbastos.featuretoggleapi.model.FeatureToggle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface IFeatureToggleService {
  FeatureToggle findById(int featureId) throws EntityNotFoundException;

  Page<FeatureToggle> listAll(Pageable pageable);

  List<FeatureToggle> findFeatures(Integer customerId, Set<Integer> featureToggleIds);

  void save(FeatureToggle request, Set<Integer> customerIds);

  void update(int featureId, FeatureTogglePartialRequest request) throws EntityNotFoundException;

  void delete(int featureId) throws EntityNotFoundException;

  void archiveById(int featureId, int customerId) throws EntityNotFoundException;

  void enableById(int featureId, int customerId) throws EntityNotFoundException;
}
