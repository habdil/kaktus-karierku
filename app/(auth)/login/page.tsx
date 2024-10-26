import { Metadata } from "next";
import { LoginForm } from "@/components/client/LoginForm";

export const metadata: Metadata = {
  title: "Login - KarierKu",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}