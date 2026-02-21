'use client'

import { useState } from 'react'
import OutputPanel from '@/components/OutputPanel'
import HistoryPanel from '@/components/HistoryPanel'
import dynamic from 'next/dynamic'

const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
})

interface DesignOutput {
  architecture: string
  dbSchema: string
  scalingPlan: string
  apiStructure: string
}

interface SavedDesign {
  id: string
  name: string
  input: string
  output: DesignOutput
  timestamp: number
}

export default function HomeContent() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<DesignOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<keyof DesignOutput>('architecture')
  const [detailLevel, setDetailLevel] = useState<'concise' | 'balanced' | 'detailed'>('balanced')
  const [history, setHistory] = useState<SavedDesign[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const EXAMPLES = [
    'Design Netflix – a streaming platform with millions of concurrent users, personalized recommendations, multi-device playback, user profiles, ratings, and search.',
    'Build an e-commerce platform like Amazon with product catalog, shopping cart, payments, inventory management, order tracking, and reviews.',
    'Create a real-time collaborative document editor like Google Docs with concurrent editing, comments, and version history.',
    'Design a Twitter-like social network with posts, likes, comments, trending topics, and user feeds.',
    'Build a video conferencing platform like Zoom with real-time video/audio, screen sharing, and recording.',
  ]

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError('Please enter a system description')
      return
    }

    setLoading(true)
    setError('')
    setOutput(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemDescription: input,
          detailLevel,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to generate design')
      }

      const data = await response.json()
      setOutput(data)
      setActiveTab('architecture')

      // Save to history
      const newDesign: SavedDesign = {
        id: Date.now().toString(),
        name: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
        input,
        output: data,
        timestamp: Date.now(),
      }
      setHistory([newDesign, ...history.slice(0, 9)])
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (example: string) => {
    setInput(example)
    setError('')
  }

  const loadFromHistory = (design: SavedDesign) => {
    setInput(design.input)
    setOutput(design.output)
    setActiveTab('architecture')
    setShowHistory(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <ThemeToggle />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3">
            🏗️ AutoArchitect
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Generate complete system designs with AI – Architecture, DB Schema, Scaling Plans, and APIs
          </p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Examples */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">📋 Examples</h3>
              <div className="space-y-2">
                {EXAMPLES.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadExample(example)}
                    className="w-full text-left text-sm p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                  >
                    {example.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 hover:opacity-80"
                >
                  ⏱️ History {history.length > 0 && `(${history.length})`}
                </button>
                {showHistory && (
                  <HistoryPanel
                    history={history}
                    onSelect={loadFromHistory}
                  />
                )}
              </div>
            )}

            {/* Settings */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">⚙️ Settings</h3>
              <div className="space-y-2">
                <label className="block text-sm text-gray-700 dark:text-gray-300">
                  Detail Level
                </label>
                <select
                  value={detailLevel}
                  onChange={(e) => setDetailLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="concise">📝 Concise</option>
                  <option value="balanced">⚖️ Balanced</option>
                  <option value="detailed">📚 Detailed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Input Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Describe Your System
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Design Netflix – a streaming platform with millions of users, personalized recommendations, live playback across devices..."
                className="w-full h-32 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={loading}
              />
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? '🔄 Generating...' : '✨ Generate Design'}
                </button>
                <button
                  onClick={() => {
                    setInput('')
                    setOutput(null)
                    setError('')
                  }}
                  className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  🗑️ Clear
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
                  {error}
                </div>
              )}
            </div>

            {/* Output Section */}
            {output && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                {/* Tabs */}
                <div className="flex gap-4 border-b-2 border-gray-300 dark:border-gray-600 mb-8 overflow-x-auto">
                  {(['architecture', 'dbSchema', 'scalingPlan', 'apiStructure'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 px-4 font-semibold whitespace-nowrap transition ${
                        activeTab === tab
                          ? 'border-b-4 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab === 'architecture' && '📐 Architecture'}
                      {tab === 'dbSchema' && '🗄️ DB Schema'}
                      {tab === 'scalingPlan' && '📈 Scaling Plan'}
                      {tab === 'apiStructure' && '🔌 API Structure'}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <OutputPanel
                  tab={activeTab}
                  output={output}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
