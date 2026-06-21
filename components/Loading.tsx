export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-12 h-12">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translate(18px) translateY(-50%)`,
              backgroundColor: `hsl(${i * 45}, 80%, 60%)`,
              animation: `fade 1s linear ${i * 0.125}s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes fade {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}