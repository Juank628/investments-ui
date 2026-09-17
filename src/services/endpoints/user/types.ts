export interface ILoginRequestBody {
  email: string;
  password: string;
}

export interface ILoginResponseBody {
  message: string;
}

export type TGetAllUsersResponseBody = string[];
