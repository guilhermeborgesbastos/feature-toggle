import { IFeature } from '@app/_shared/interfaces';

export class Feature implements IFeature {
  id: number;
  displayName?: string;
  technicalName: string;
  expiresOn?: Date;
  description?: string;
  inverted: boolean;
  customerIds?: number[];
}
