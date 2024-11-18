export type DiagramType = 
  | 'flowchart'
  | 'architecture'
  | 'organization'
  | 'network'
  | 'erd'
  | 'sequence'
  | 'mindmap'

export interface DiagramElement {
  id: string
  type: 'shape' | 'connector' | 'text'
  x: number
  y: number
  width: number
  height: number
  style: DiagramStyle
  content?: string
  relationships?: string[] // IDs of connected elements
  groupId?: string
}

export interface DiagramStyle {
  fill: string
  stroke: string
  strokeWidth: number
  fontSize?: number
  fontFamily?: string
  opacity?: number
  shadow?: boolean
  gradient?: {
    type: 'linear' | 'radial'
    stops: Array<{
      offset: number
      color: string
    }>
  }
}

export interface DiagramState {
  id?: string
  type: DiagramType
  title: string
  elements: DiagramElement[]
  selectedIds: string[]
  scale: number
  offset: { x: number; y: number }
  version: number
  lastModified: string
  createdBy: string
}

export interface DiagramVersion {
  id: string
  diagramId: string
  version: number
  changes: DiagramChange[]
  timestamp: string
  author: string
}

export interface DiagramChange {
  type: 'add' | 'update' | 'delete' | 'move' | 'style'
  elementId: string
  data: Partial<DiagramElement>
  previousData?: Partial<DiagramElement>
} 