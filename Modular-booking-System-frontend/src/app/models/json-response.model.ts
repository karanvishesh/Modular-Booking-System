import { User } from "./user.model";
export interface JsonResponse<T> {
  data?: T;
  message: string;
  statusCode: number;
  success: boolean;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: User;
}
