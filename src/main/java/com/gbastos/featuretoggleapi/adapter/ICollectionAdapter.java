package com.gbastos.featuretoggleapi.adapter;

import java.util.List;

/**
 * It provides a way of mapping the JPA entities into Response model.
 *
 * @param <S> the persistence entity object.
 * @param <T> the request model object.
 * @param <U> the response model object.
 * @author Guilherme Borges Bastos
 */
public interface ICollectionAdapter<S, T, U> {

  /**
   * It maps Entity models into Response models.
   *
   * @param entity the entity model object.
   * @return the response model object.
   */
  U mapEntityToResponse(List<S> entities);
}
