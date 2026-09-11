import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Barbería Premium | Reserva tu Cita',
  description: 'Sistema de reservas online para la mejor experiencia de barbería.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      {/* Importamos Playfair Display para títulos */}
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-[#121212] text-gray-200`}>
        {children}
      </body>
    </html>
  )
}