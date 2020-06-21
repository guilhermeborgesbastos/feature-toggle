package com.gbastos.featuretoggleapi.adapter;

/**
 * It provides ways of mapping the @RequestBody models into JPA entities and entities into Response
 * models, allowing the flexibility of changing the Request/Response Models without side-effecting
 * the persistence models(entities). The same is true for the opposite, allowing changes on the
 * persistence models without necessarily changing the Request/Response models.
 *
 * @param <Entity>
 * @param <Request>
 * @param <Response>
 * @author Guilherme Borges Bastos
 */
public interface IAdapter<Entity, Request, Response> {

  /**
   * It maps Request models into persistence models.
   *
   * @param request the request model object.
   * @return the persistence model object (entity).
   */
  Entity mapRequestToEntity(Request request);

  /**
   * It maps Entity models into Response models.
   *
   * @param entity the entity model object.
   * @return the response model object.
   */
  Response mapEntityToResponse(Entity entity);
}
