import { useEffect, useRef, useState } from 'react';

// Confetti colors matching the screenshot style
const COLORS = [
  '#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ff6b81',
  '#eccc68', '#a29bfe', '#fd79a8', '#00cec9', '#fdcb6e',
  '#6c5ce7', '#e17055', '#55efc4', '#74b9ff'
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function ConfettiPiece({ style }) {
  return <div className="confetti-piece" style={style} />;
}

export default function FirstOrderCelebration({ onDone }) {
  const [pieces, setPieces] = useState([]);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef();

  useEffect(() => {
    // Generate 90 confetti pieces
    const generated = Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: `${randomBetween(0, 100)}%`,
      width: `${randomBetween(8, 16)}px`,
      height: `${randomBetween(6, 12)}px`,
      background: COLORS[Math.floor(Math.random() * COLORS.length)],
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      animationDuration: `${randomBetween(2.5, 4.5)}s`,
      animationDelay: `${randomBetween(0, 1.5)}s`,
      transform: `rotate(${randomBetween(-45, 45)}deg)`,
      opacity: randomBetween(0.7, 1),
    }));
    setPieces(generated);

    // Auto-dismiss after 4.5s
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone && onDone(), 500);
    }, 4500);

    return () => clearTimeout(timerRef.current);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    clearTimeout(timerRef.current);
    setTimeout(() => onDone && onDone(), 400);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes celebration-in {
          0%   { transform: scale(0.5) translateY(40px); opacity: 0; }
          60%  { transform: scale(1.08) translateY(-6px); }
          100% { transform: scale(1) translateY(0);       opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59,168,41,0.5); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 18px rgba(59,168,41,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59,168,41,0); }
        }
        .confetti-piece {
          position: fixed;
          top: -20px;
          animation: confetti-fall linear forwards;
          pointer-events: none;
          z-index: 9999;
        }
        .celebration-card {
          animation: celebration-in 0.55s cubic-bezier(.34,1.56,.64,1) both;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #3ba829 25%, #fbbf24 50%, #3ba829 75%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2s linear infinite;
        }
        .pulse-btn {
          animation: pulse-ring 1.5s ease-out infinite;
        }
        .fade-out-overlay {
          animation: fade-out 0.4s ease forwards;
        }
        @keyframes fade-out {
          to { opacity: 0; }
        }
      `}</style>

      {/* Full-screen overlay */}
      <div
        className="fixed inset-0 z-[9998] flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
        onClick={handleDismiss}
      >
        {/* Confetti pieces */}
        {pieces.map(p => (
          <div
            key={p.id}
            className="confetti-piece"
            style={{
              left: p.left,
              width: p.width,
              height: p.height,
              background: p.background,
              borderRadius: p.borderRadius,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
              transform: p.transform,
              opacity: p.opacity,
            }}
          />
        ))}

        {/* Celebration Card */}
        <div
          className="celebration-card relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-[90%] text-center"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* Trophy emoji */}
          <div className="text-7xl mb-4 select-none" style={{ filter: 'drop-shadow(0 4px 12px rgba(251,191,36,0.4))' }}>
            🎉
          </div>

          {/* Congratulations heading */}
          <h2 className="text-3xl md:text-4xl font-black mb-2 shimmer-text">
            Congratulations!
          </h2>
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-6">
            Your First Order is Placed!
          </p>

          {/* Free Shipping Banner */}
          <div
            className="rounded-2xl px-6 py-4 mb-6 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #3ba829 0%, #22c55e 100%)' }}
          >
            <span className="text-3xl">🚚</span>
            <div className="text-left">
              <div className="text-white font-black text-lg leading-tight">FREE SHIPPING</div>
              <div className="text-green-100 text-xs font-semibold">Unlocked on your first order!</div>
            </div>
            <div className="ml-auto bg-white/20 rounded-xl px-3 py-1">
              <span className="text-white font-black text-sm">₹0</span>
            </div>
          </div>

          {/* Sub-message */}
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            Welcome to the NRM family! 🌾 Your order is being processed and you'll receive a confirmation shortly.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleDismiss}
            className="pulse-btn w-full bg-[#3ba829] hover:bg-[#318b22] text-white font-black py-4 rounded-2xl text-base uppercase tracking-widest transition-colors shadow-lg shadow-green-200"
          >
            View My Orders 🎊
          </button>
        </div>
      </div>
    </>
  );
}
