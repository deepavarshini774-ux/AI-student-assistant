/**
 * Soft, blurred gradient blobs floating behind the page content.
 * Purely decorative — gives the app depth instead of a flat cream
 * background. Pointer-events disabled so it never blocks clicks.
 */
export default function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent-blush/40 blur-3xl animate-float" />
      <div
        className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-accent-mauve/30 blur-3xl animate-float"
        style={{ animationDelay: "1.2s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-accent-indigo/15 blur-3xl animate-float"
        style={{ animationDelay: "0.6s" }}
      />
    </div>
  );
}
