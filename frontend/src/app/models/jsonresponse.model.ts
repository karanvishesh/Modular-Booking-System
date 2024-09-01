import { User } from './user.model.js';
interface JsonResponse<T> {
  data?: T;
  message: string;
  statusCode: number;
  success: boolean;
}

interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type { JsonResponse, AuthData };
