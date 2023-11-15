"use client"
import './globals.css'
import MyNavBar from './MyNavBar/page';
import { useWindowWidth, MarginNavBarHandle } from './features';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const windowWidth = useWindowWidth();
  const ChangeLeftMargin = MarginNavBarHandle(windowWidth);

  return (
    <html lang="fr">
      <head>
        <title>Site Hub</title>
        <link rel="icon" type="image/vnd.icon" href="/image/epitech_logo.ico" />
      </head>
      <body className="bg-gray-200 m-0 p-0">
        <div className='App'>
          <MyNavBar />
        </div>
        <div className={`${ChangeLeftMargin}`}>
          <div>{children}</div>
        </div>
      </body>
    </html>
    );
}
