import { Role } from '@app/_models/user';

export interface IUser {
  id: number;
  role: Role;
  name: string;
  email: string;
  status: string;
}

export interface IPageParams {
  page: number;
  size: number;
}

export interface IRestResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: { sorted: boolean; unsorted: boolean; empty: boolean };
}
