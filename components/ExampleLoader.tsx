'use client'

interface ExampleLoaderProps {
  onSelect: (example: string) => void
}

const EXAMPLES = [
  'Design Netflix – a streaming platform with millions of concurrent users, personalized recommendations, multi-device playback, user profiles, ratings, and search.',
  'Build an e-commerce platform like Amazon with product catalog, shopping cart, payments, inventory management, order tracking, and reviews.',
  'Create a real-time collaborative document editor like Google Docs with concurrent editing, comments, and version history.',
  'Design a Twitter-like social network with posts, likes, comments, trending topics, and user feeds.',
  'Build a video conferencing platform like Zoom with real-time video/audio, screen sharing, and recording.',
]

export default function ExampleLoader({ onSelect }: ExampleLoaderProps) {
  return (
    <div className="space-y-2">
      {EXAMPLES.map((example, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(example)}
          className="w-full text-left text-sm p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition text-gray-700 dark:text-gray-300"
        >
          {example.substring(0, 40)}...
        </button>
      ))}
    </div>
  )
}
