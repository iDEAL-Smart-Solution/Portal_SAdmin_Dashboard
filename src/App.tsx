import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="text-center">
          <div className="flex justify-center space-x-8 mb-8">
            <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
              <img src={viteLogo} className="h-24 w-24 hover:opacity-80 transition-opacity" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
              <img src={reactLogo} className="h-24 w-24 hover:opacity-80 transition-opacity animate-spin" alt="React logo" />
            </a>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Portal Dev Dashboard
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Vite + React + TypeScript + Tailwind CSS
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Count is {count}
            </button>
          </div>
          
          <p className="text-sm text-gray-500">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
