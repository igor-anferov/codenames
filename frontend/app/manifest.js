export default function manifest() {
  return {
    name: 'Codenames Game',
    short_name: 'Codenames',
    description: "Онлайн-версия популярной настолькой игры",
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
