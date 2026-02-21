'use client'

import { useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import MermaidDiagram from './MermaidDiagram'
import CodeBlock from './CodeBlock'

interface DesignOutput {
  architecture: string
  dbSchema: string
  scalingPlan: string
  apiStructure: string
}

interface OutputPanelProps {
  tab: keyof DesignOutput
  output: DesignOutput
}

export default function OutputPanel({ tab, output }: OutputPanelProps) {
  const content = output[tab]
  const diagramRef = useRef<HTMLDivElement>(null)

  const downloadAsFile = (filename: string, content: string) => {
    const element = document.createElement('a')
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    )
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadDiagramAsImage = async (format: 'png' | 'jpg' | 'pdf') => {
    if (!diagramRef.current) return
    
    try {
      const canvas = await html2canvas(diagramRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      })
      
      if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
        })
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 280
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
        pdf.save('architecture-diagram.pdf')
      } else {
        const dataUrl = canvas.toDataURL(`image/${format}`)
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `architecture-diagram.${format}`
        link.click()
      }
    } catch (error) {
      console.error('Error downloading diagram:', error)
      alert('Failed to download diagram. Please try again.')
    }
  }

  const downloadAllAsZip = async () => {
    // For MVP, just download them one by one with notification
    downloadAsFile('architecture-diagram.mmd', output.architecture)
    downloadAsFile('database-schema.sql', output.dbSchema)
    downloadAsFile('scaling-plan.txt', output.scalingPlan)
    downloadAsFile('api-structure.json', output.apiStructure)
  }

  const handleDownload = async () => {
    if (tab === 'architecture') {
      // Show download format options for architecture
      const format = window.confirm('Download as PDF? (OK for PDF, Cancel for PNG)')
      downloadDiagramAsImage(format ? 'pdf' : 'png')
    } else {
      const filenames = {
        dbSchema: 'database-schema.sql',
        scalingPlan: 'scaling-plan.txt',
        apiStructure: 'api-structure.json',
      }
      downloadAsFile(filenames[tab], content)
    }
  }


  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition"
        >
          ⬇️ Download
        </button>
        <button
          onClick={downloadAllAsZip}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
        >
          📦 Download All
        </button>
      </div>

      {tab === 'architecture' && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">System Architecture Diagram</h3>
          {!content || content.trim().length === 0 ? (
            <div className="p-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
              No architecture data available. Try generating again.
            </div>
          ) : (
            <div>
              <div ref={diagramRef} className="bg-white p-4 rounded-lg">
                <MermaidDiagram content={content} />
              </div>
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                <details>
                  <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">View raw Mermaid code</summary>
                  <pre className="bg-white dark:bg-gray-800 p-3 mt-2 rounded text-xs overflow-x-auto">{content}</pre>
                </details>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'dbSchema' && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Database Schema (SQL DDL)</h3>
          <CodeBlock code={content} language="sql" title="database-schema.sql" />
        </div>
      )}

      {tab === 'scalingPlan' && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Scaling & Infrastructure Plan</h3>
          <div className="bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-600 dark:border-blue-400 p-6 rounded">
            <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed">
              {content}
            </div>
          </div>
        </div>
      )}

      {tab === 'apiStructure' && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">API Endpoint Structure</h3>
          <CodeBlock
            code={
              content.startsWith('{')
                ? JSON.stringify(JSON.parse(content), null, 2)
                : content
            }
            language="json"
            title="api-endpoints.json"
          />
        </div>
      )}
    </div>
  )
}
