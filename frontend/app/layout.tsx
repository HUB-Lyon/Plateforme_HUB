"use client"
import './globals.css'
import NavBar from './NavBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="fr">
      <head>
        <title>Site Hub</title>
        <link rel="icon" type="image/vnd.icon" href="/image/epitech_logo.ico" />
      </head>
      <body className="bg-gray-200 m-0 p-0 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
        <NavBar />
        <div className="lg:ml-72 mt-16">
          <div>{children}</div>
        </div>
      </body>
    </html>
    );
}
