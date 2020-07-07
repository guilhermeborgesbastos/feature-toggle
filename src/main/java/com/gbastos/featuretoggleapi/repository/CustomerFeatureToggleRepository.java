package com.gbastos.featuretoggleapi.repository;

import com.gbastos.featuretoggleapi.model.CustomerFeatureToggle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface CustomerFeatureToggleRepository
    extends JpaRepository<CustomerFeatureToggle, Integer> {

  @Query("SELECT cft FROM CustomerFeatureToggle cft WHERE cft.customer.id = :customerId and cft.featureToggle.id = :featureToggleId")
  Optional<CustomerFeatureToggle> fetchCustomerFeatureToggleByCustomerAndFeature(
      @Param("customerId") Integer customerId, @Param("featureToggleId") Integer featureToggleId);

  @Transactional
  @Modifying
  @Query("DELETE FROM CustomerFeatureToggle cft WHERE cft.featureToggle.id = :featureToggleId")
  void deleteByFeatureToggleId(@Param("featureToggleId") Integer featureToggleId);
}