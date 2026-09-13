export function BackgroundLayers() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      <div className="absolute -top-10 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl md:top-20 md:right-20 md:h-96 md:w-96" />
      <div className="absolute bottom-0 -left-10 h-64 w-64 rounded-full bg-gradient-to-br from-pink-400/10 to-orange-400/10 blur-3xl md:bottom-20 md:left-20 md:h-80 md:w-80" />
    </div>
  );
}
