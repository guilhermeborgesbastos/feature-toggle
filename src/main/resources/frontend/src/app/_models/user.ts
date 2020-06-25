import { IUser } from '@app/_shared/interfaces';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PRODUCT_OWNER = 'PRODUCT_OWNER',
}

export class User implements IUser {
  id: number;
  role: Role;
  name: string;
  email: string;
  status: string;
}
