import { Space_Grotesk, Outfit } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata = {
  title: "WeRelaySyllabus",
  description: "Course registration and vouching system",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={`${spaceGrotesk.variable} ${outfit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}