export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-gray-500">
      <div className="h-5 w-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
