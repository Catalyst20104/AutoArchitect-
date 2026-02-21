'use client'

interface HistoryItem {
  id: string
  name: string
  input: string
  output: any
  timestamp: number
}

interface HistoryPanelProps {
  history: HistoryItem[]
  onSelect: (item: HistoryItem) => void
}

export default function HistoryPanel({ history, onSelect }: HistoryPanelProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="w-full text-left p-3 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition border border-gray-200 dark:border-gray-600"
        >
          <div className="text-sm text-gray-900 dark:text-white font-medium truncate">
            {item.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(item.timestamp)}
          </div>
        </button>
      ))}
    </div>
  )
}
