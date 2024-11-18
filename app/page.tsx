"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { ChatPanel } from "@/components/chat/chat-panel"
import { EditorPanel } from "@/components/editor/editor-panel"

export default function HomePage() {
  const [currentSvgCode, setCurrentSvgCode] = useState<string>("")

  return (
    <MainLayout>
      <div className="container flex h-full">
        <ChatPanel 
          className="w-2/5 min-w-[320px] border-r" 
          onDiagramGenerated={setCurrentSvgCode}
        />
        <EditorPanel 
          className="w-3/5 min-w-[480px]"
          svgCode={currentSvgCode}
        />
      </div>
    </MainLayout>
  )
}
