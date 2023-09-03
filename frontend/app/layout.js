import React from 'react';

import { Roboto } from 'next/font/google';

import './globals.css';

export const metadata = {
  title: "Codenames",
  description: "Онлайн-версия популярной настолькой игры",
  themeColor: "white",
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  icons: {
    safariPinnedTab: {
      rel: 'mask-icon',
      url: '/safari-pinned-tab.svg',
      color: '#ff5f30',
    },
  },
}

const robotoFont = Roboto({
  subsets: ['cyrillic'],
  weight: ['300', '400', '500', '700'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={ robotoFont.className }>
      <body>
        <div id="root">
          <React.StrictMode>
            { children }
          </React.StrictMode>
        </div>
      </body>
    </html>
  )
}
