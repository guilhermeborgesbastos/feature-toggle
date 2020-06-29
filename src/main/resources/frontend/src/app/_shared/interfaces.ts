import { Role } from '@app/_models/user';

export interface IUser extends AbstractResource {
  role: Role;
  name: string;
  email: string;
  status: string;
}
export interface ICustomer extends AbstractResource {
  name: string;
}

export interface IPageParams {
  page: number;
  size: number;
}

export interface AbstractResource {
  id: number;
}

export interface IRestResponse<T extends AbstractResource> {
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
export interface ApiError {
  debugMessage?: string;
  message: string;
  status: string;
  subErrors: [
    {
      field: string;
      message: string;
      object: string;
      rejectedValue: string;
    }
  ];
  timestamp: string;
}

export function formatError(httpError: any): string {
  if (httpError && httpError.error && httpError.error.apierror) {
    const error = httpError.error.apierror;
    console.log(error);
    let msg = error.message;
    for (let i = 0; i < error.subErrors.length; i++) {
      const e = error.subErrors[i];
      msg += `: ${e.message} on ${e.field}\n`;
    }
    return msg;
  }
  return httpError.message ? httpError.message : 'connection problem with server';
}
