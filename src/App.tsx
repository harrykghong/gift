
import { useState } from 'react'
import Scene from './components/Scene'

function App() {
  const [disperse, setDisperse] = useState(0) // 0 to 1

  return (
    <div className="w-full h-screen bg-black relative">
      <Scene disperse={disperse} />

      <div className="absolute top-0 left-0 p-4 text-white pointer-events-none z-10">
        <h1 className="text-2xl font-bold text-christmas-gold drop-shadow-lg">Christmas Tree</h1>
        <p className="text-sm opacity-80">Drag the slider to disperse the tree</p>
      </div>

      {/* Slider Control */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 h-64 flex flex-col items-center gap-4 z-20">
        <div className="h-full w-2 bg-white/20 rounded-full relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={disperse}
            onChange={(e) => setDisperse(parseFloat(e.target.value))}
            className="absolute inset-0 w-64 h-2 -rotate-90 origin-top-left translate-y-64 cursor-pointer opacity-0"
          />
          {/* Visual Indicator */}
          <div
            className="absolute bottom-0 left-0 w-full bg-christmas-gold rounded-full transition-all duration-75"
            style={{ height: `${disperse * 100}% ` }}
          />
          {/* Thumb */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg pointer-events-none transition-all duration-75"
            style={{ bottom: `calc(${disperse * 100} % - 12px)` }}
          />
        </div>
        <span className="text-white/80 text-xs font-mono">DISPERSE</span>
      </div>
    </div>
  )
}

export default App

