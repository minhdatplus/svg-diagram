"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { generateDiagramFromPrompt } from "@/lib/api/gemini"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  svgCode?: string
}

interface ChatPanelProps {
  className?: string
  onDiagramGenerated?: (svgCode: string) => void
}

export function ChatPanel({ className, onDiagramGenerated }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    
    try {
      // Log để debug
      console.log('Submitting prompt...')
      
      const svgCode = await generateDiagramFromPrompt(input)
      
      if (svgCode) {
        // Add AI response with generated SVG
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I\'ve generated a diagram based on your description.',
          svgCode,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
        
        // Update editor panel
        onDiagramGenerated?.(svgCode)
        
        toast({
          title: "Diagram generated successfully",
          description: "The SVG diagram has been created based on your description.",
        })
      } else {
        throw new Error('Failed to generate SVG diagram')
      }
    } catch (error: any) {
      console.error('Error details:', error)
      
      toast({
        title: "Error generating diagram",
        description: error.message || "Failed to generate the diagram. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col space-y-2 p-4 rounded-lg",
                message.role === 'user' 
                  ? "bg-primary text-primary-foreground ml-8" 
                  : "bg-muted mr-8"
              )}
            >
              <div className="text-sm font-medium">
                {message.role === 'user' ? 'You' : 'AI Assistant'}
              </div>
              <div className="text-sm">{message.content}</div>
              {message.svgCode && (
                <div className="mt-2 p-2 bg-background rounded border">
                  <div className="text-xs font-mono overflow-x-auto">
                    {message.svgCode}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the diagram you want to create..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  )
} 