package com.gbastos.featuretoggleapi.repository;

import com.gbastos.featuretoggleapi.model.FeatureToggle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface FeatureToggleRepository extends JpaRepository<FeatureToggle, Integer> {

  /**
   * It fetches all the features in a collection assigned to a given customer.
   *
   * @param customerId
   * @param featureToggleIds the collection with targeting features
   * @return the list of features.
   */
  @Query(value = "SELECT ft FROM Customer c "
              + "INNER JOIN CustomerFeatureToggle cft ON cft.customer.id = c.id "
              + "INNER JOIN FeatureToggle ft ON ft.id = cft.featureToggle.id "
              + "WHERE cft.customer.id = :customerId AND cft.featureToggle.id IN (:featureToggleIds) "
              + "ORDER BY ft.technicalName")
  Optional<List<FeatureToggle>> fetchByCustomerAndFeaturesIn(
      @Param("customerId") Integer customerId,
      @Param("featureToggleIds") Set<Integer> featureToggleIds);

  /**
   * It fetches all the features assigned to a given customer.
   *
   * @param customerId
   * @return the list of features.
   */
  @Query(value = "SELECT ft FROM Customer c "
          + "INNER JOIN CustomerFeatureToggle cft ON cft.customer.id = c.id "
          + "INNER JOIN FeatureToggle ft ON ft.id = cft.featureToggle.id "
          + "WHERE cft.customer.id = :customerId "
          + "ORDER BY ft.technicalName")
  Optional<List<FeatureToggle>> fetchByCustomer(@Param("customerId") Integer customerId);
}
