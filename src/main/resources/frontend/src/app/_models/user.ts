import { IUser } from '@app/_shared/interfaces';

export enum Role {
  SUPER_ADMIN = 1, // The SUPER ADMIN has the ROLE ID equals to 1 on the API
  PRODUCT_OWNER = 2, // The PRODUCT_OWNER has the ROLE ID equals to 2 on the API
  CLIENT = 3, // The CLIENT has the ROLE ID equals to 3 on the API
}

export class User implements IUser {
  id: number;
  role: Role;
  name: string;
  email: string;
  status: string;
}
