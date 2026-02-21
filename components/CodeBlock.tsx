'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language: string
  title?: string
}

export default function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden mb-6">
      <div className="flex justify-between items-center bg-gray-800 dark:bg-gray-800 px-4 py-3">
        <span className="text-gray-300 text-sm font-mono">{title || language}</span>
        <button
          onClick={handleCopy}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-1 rounded text-sm transition"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-gray-100 text-sm overflow-x-auto max-h-96">
        <code>{code}</code>
      </pre>
    </div>
  )
}
