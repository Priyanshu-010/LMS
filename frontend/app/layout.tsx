import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "LearnHub — LMS",
  description: "A modern learning management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#09090b] text-zinc-100 min-h-screen antialiased">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex justify-between">
          <Sidebar />
          {children}
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#18181b",
              color: "#f4f4f5",
              border: "1px solid #3f3f46",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: {
                primary: "#a78bfa",
                secondary: "#18181b",
              },
            },
            error: {
              iconTheme: {
                primary: "#f87171",
                secondary: "#18181b",
              },
            },
          }}
        />
      </body>
    </html>
  );
}