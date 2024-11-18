import { Header } from "@/components/header"
import { Toolbar } from "@/components/toolbar"
import { StatusBar } from "@/components/status-bar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <Toolbar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <StatusBar />
    </div>
  )
} 