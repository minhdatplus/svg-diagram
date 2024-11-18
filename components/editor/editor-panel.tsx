"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Hand } from "lucide-react"

interface EditorPanelProps {
  className?: string
  svgCode?: string
}

interface Transform {
  x: number
  y: number
  scale: number
}

export function EditorPanel({ className, svgCode: externalSvgCode }: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('preview')
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPanMode, setIsPanMode] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [internalSvgCode, setInternalSvgCode] = useState<string>(`
    <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <!-- Initial SVG content -->
    </svg>
  `.trim())

  const svgCode = externalSvgCode || internalSvgCode

  useEffect(() => {
    if (externalSvgCode) {
      setInternalSvgCode(externalSvgCode)
    }
  }, [externalSvgCode])

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isPanMode) return
    setIsDragging(true)
    setStartPos({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    })
  }, [transform, isPanMode])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !isPanMode) return
    
    setTransform(prev => ({
      ...prev,
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    }))
  }, [isDragging, startPos, isPanMode])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isPanMode) return
    e.preventDefault()
    
    setTransform(prev => {
      const delta = e.deltaY < 0 ? 0.1 : -0.1
      const newScale = Math.min(Math.max(0.5, prev.scale + delta), 3)
      
      return {
        ...prev,
        scale: newScale
      }
    })
  }, [isPanMode])

  const resetTransform = () => {
    setTransform({ x: 0, y: 0, scale: 1 })
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className={cn("flex flex-col h-full relative", className)}>
      <div className="flex items-center justify-between p-4 border-b">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="h-[calc(100vh-12rem)]">
            <div 
              ref={containerRef}
              className="h-full w-full flex items-center justify-center bg-grid-pattern overflow-hidden relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{
                cursor: isPanMode ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
            >
              <div 
                className="w-full h-full"
                style={{
                  transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: svgCode
                }}
              />
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg">
              <Button
                variant={isPanMode ? "default" : "outline"}
                size="icon"
                onClick={() => setIsPanMode(!isPanMode)}
                title="Pan Mode"
              >
                <Hand className="h-4 w-4" />
              </Button>

              <div className="w-px h-4 bg-border mx-2" />

              <Button
                variant="outline"
                size="icon"
                onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(0.5, prev.scale - 0.1) }))}
                title="Zoom Out"
                disabled={!isPanMode}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={resetTransform}
                title="Reset View"
                disabled={!isPanMode}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(3, prev.scale + 0.1) }))}
                title="Zoom In"
                disabled={!isPanMode}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <div className="w-px h-4 bg-border mx-2" />

              <Button
                variant="outline"
                size="icon"
                onClick={handleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="code" className="h-[calc(100vh-12rem)]">
            <div className="relative h-full">
              <textarea
                className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none"
                value={svgCode}
                onChange={(e) => setInternalSvgCode(e.target.value)}
                spellCheck={false}
                style={{
                  minHeight: '300px',
                  whiteSpace: 'pre',
                  overflowWrap: 'normal',
                  overflowX: 'auto'
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => {
            const blob = new Blob([svgCode], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'diagram.svg'
            a.click()
            URL.revokeObjectURL(url)
          }}>
            Export SVG
          </Button>
        </div>
      </div>
    </div>
  )
} 