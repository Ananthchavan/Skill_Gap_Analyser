import { Link } from 'react-router-dom'

/* Decorative network-dot SVG background (top-right area) */
function NetworkBg() {
  /* generate a grid of dots connected by lines — purely decorative */
  const nodes = [
    { x: 560, y: 20  }, { x: 620, y: 60  }, { x: 700, y: 30  },
    { x: 750, y: 90  }, { x: 680, y: 130 }, { x: 800, y: 140 },
    { x: 630, y: 170 }, { x: 710, y: 200 }, { x: 770, y: 60  },
    { x: 840, y: 100 }, { x: 590, y: 110 }, { x: 660, y: 80  },
  ]
  const edges = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],
    [0,11],[11,1],[11,10],[10,4],[1,8],[8,3],[3,9],[9,5],
    [6,10],[6,4],[2,8],[7,9],
  ]
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
      viewBox="0 0 860 220"
      preserveAspectRatio="xMaxYMid slice"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="white" strokeWidth="0.8" strokeOpacity="0.6"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="3" fill="white" fillOpacity="0.7" />
      ))}
    </svg>
  )
}

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-800 to-purple-900 py-16 px-4">
      {/* network background */}
      <NetworkBg />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug mb-8">
          Your dream job requires specific skills.<br />
          Don't waste time learning the wrong ones.
        </h2>

        <Link
          to="/signup"
          className="inline-block bg-transparent hover:bg-white/10 active:scale-95
                     text-white font-semibold text-base px-10 py-3.5
                     rounded-full border-2 border-white/70 hover:border-white
                     transition-all duration-200 backdrop-blur-sm"
        >
          Start Your 30-Day Plan Now
        </Link>
      </div>
    </section>
  )
}
