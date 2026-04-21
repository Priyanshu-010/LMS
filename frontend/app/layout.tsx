import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "LMS App",
  description: "Simple LMS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#09090b] text-zinc-100 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-6 py-12">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}