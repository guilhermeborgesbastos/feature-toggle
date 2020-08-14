import { AbstractResource } from '@app/_shared/interfaces';

export interface IFeature extends AbstractResource {
  technicalName: string;
  displayName?: string;
  expiresOn?: Date;
  description?: string;
  inverted: boolean;
  customerIds?: number[];
}

export class Feature implements IFeature {
  id: number;
  displayName?: string;
  technicalName: string;
  expiresOn?: Date;
  description?: string;
  inverted: boolean;
  customerIds?: number[];
}
