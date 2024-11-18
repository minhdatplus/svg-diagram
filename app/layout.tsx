import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { metadata } from "./metadata"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
