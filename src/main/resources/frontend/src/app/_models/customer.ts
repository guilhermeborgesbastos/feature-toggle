import { ICustomer } from '@app/_shared/interfaces';

export class Customer implements ICustomer {
  id: number;
  name: string;
}
