import { Metadata } from "next";
import { MentorLoginForm } from "../../../components/mentor/MentorLoginForm";

export const metadata: Metadata = {
  title: "Mentor Login - KarierKu",
  description: "Login to your mentor dashboard",
};

export default function MentorLoginPage() {
  return <MentorLoginForm />;
}