package com.gbastos.featuretoggleapi.repository;

import com.gbastos.featuretoggleapi.model.FeatureToggle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeatureToggleRepository extends JpaRepository<FeatureToggle, Integer> {}
