import { AbstractResource } from '../interfaces';

export interface IFeatureToggle extends AbstractResource {
  name: string;
  active: boolean;
  inverted: boolean;
  expired: boolean;
}
