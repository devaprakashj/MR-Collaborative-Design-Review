import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { ToastContainer } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "MR Collaborative Design Review | Architectural CAD & BIM Platform",
  description:
    "Next-generation collaborative architecture design review platform. Inspect 3D BIM models, resolve spatial clashes, add precision annotations, and certify designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-cad-950 text-cad-50 antialiased selection:bg-cyan selection:text-cad-950">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}

