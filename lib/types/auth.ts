export interface AuthenticatedResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    role: "ADMIN" | "MENTOR" | "CLIENT";
    fullName?: string;
  };
}

export interface AuthRedirect {
  callbackUrl?: string;
}