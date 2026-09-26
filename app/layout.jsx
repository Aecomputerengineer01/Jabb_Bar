import { Prompt, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  display: 'swap',
  variable: '--font-prompt',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata = {
  title: 'ระบบนับสต็อกสินค้าเครื่องดื่ม - ร้านจ๊าบบาร์ (Jabb Bar)',
  description: 'ระบบนับสต็อกสินค้าเครื่องดื่ม ร้านจ๊าบบาร์ โหมดกลางคืน (Dark Mode) รองรับมือถือและแท็บเล็ต',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍸</text></svg>",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#07090e',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`dark ${prompt.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bar-950 text-slate-100 font-sans antialiased min-h-screen selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
