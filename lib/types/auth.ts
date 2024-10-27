// Tambahan tipe data LoginCredentials dan AdminSessionData
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminSessionData {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN";
}

// Tipe data AuthenticatedResponse dan AuthRedirect
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
