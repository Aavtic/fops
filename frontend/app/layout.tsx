import './globals.css'
import { Toaster } from "sonner"

import Navbar from '@/components/NavBar/NavBar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        
        {/* Put Navbar INSIDE the fixed header */}
        <header className="fixed top-0 left-0 right-0 z-50">
           <Navbar/>
        </header>

        {/* Keep the padding to prevent content from hiding behind the fixed header */}
        <main className="pt-16 min-h-screen bg-slate-50">
            {children}
        </main>
        
        <Toaster />
      </body>
    </html>
  );
}
