import './globals.css'
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
  <html lang="en">
    <body>
      <div className="min-h-screen w-full relative">
        {/* Radial Gradient Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
          }}
        />
        
        {/* Foreground content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
      <Toaster />
    </body>
  </html>
);
}

