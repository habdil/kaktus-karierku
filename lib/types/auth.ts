export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AdminSessionData {
    id: string;
    email: string;
    fullName: string;
    role: 'ADMIN';
  }