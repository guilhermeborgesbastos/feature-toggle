import { AbstractResource } from '@app/_shared/interfaces';

export interface ICustomer extends AbstractResource {
  name: string;
  featureIds?: number[];
}

export class Customer implements ICustomer {
  id: number;
  name: string;
}
