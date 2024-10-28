import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ChatbotButton from "@/components/public/modal/ChatbotButton";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}

        <ChatbotButton />

      </main>
      <Footer />
    </div>
  );
}