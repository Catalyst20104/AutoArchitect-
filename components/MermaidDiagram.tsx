'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  content: string
}

export default function MermaidDiagram({ content }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<string>('')

  useEffect(() => {
    // Initialize mermaid once
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    
    if (!content || content.trim().length === 0) {
      containerRef.current.innerHTML = `
        <div class="p-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-center">
          No architecture data
        </div>
      `
      return
    }

    const renderDiagram = async () => {
      try {
        // Clean up the content
        let cleanedContent = content.trim()
        if (cleanedContent.startsWith('```mermaid')) {
          cleanedContent = cleanedContent.replace(/^```mermaid\n?/, '').replace(/\n?```$/, '')
        } else if (cleanedContent.startsWith('```')) {
          cleanedContent = cleanedContent.replace(/^```\n?/, '').replace(/\n?```$/, '')
        }
        cleanedContent = cleanedContent.trim()
        
        console.log('Rendering Mermaid diagram:', cleanedContent.substring(0, 100))
        
        // Generate unique ID for this diagram
        const diagramId = `mermaid-${Date.now()}`
        
        // Render the diagram
        const { svg } = await mermaid.render(diagramId, cleanedContent)
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          // Apply styling to the SVG
          const svgElement = containerRef.current.querySelector('svg')
          if (svgElement) {
            svgElement.style.maxWidth = '100%'
            svgElement.style.height = 'auto'
          }
        }
      } catch (error: any) {
        console.error('Mermaid render error:', error)
        if (containerRef.current) {
          const errorMsg = error.message || 'Invalid diagram syntax'
          containerRef.current.innerHTML = `
            <div class="p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
              <p class="font-bold mb-2">⚠️ Diagram Error</p>
              <p class="text-sm mb-3">${errorMsg}</p>
              <details class="mt-3">
                <summary class="cursor-pointer text-sm underline">View raw Mermaid code</summary>
                <pre class="bg-white dark:bg-gray-800 p-3 mt-2 rounded text-xs overflow-x-auto max-h-48">${content.substring(0, 500)}</pre>
              </details>
            </div>
          `
        }
      }
    }

    renderDiagram()
  }, [content])

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 overflow-x-auto min-h-96 flex items-center justify-center"
    />
  )
}
