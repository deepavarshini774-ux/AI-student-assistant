const LEVELS = [
  { label: "Beginner", active: "bg-emerald-500 border-emerald-500", ring: "hover:border-emerald-300" },
  { label: "Intermediate", active: "bg-amber-500 border-amber-500", ring: "hover:border-amber-300" },
  { label: "Advanced", active: "bg-rose-500 border-rose-500", ring: "hover:border-rose-300" },
];

export default function DifficultySelector({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {LEVELS.map((level) => (
        <button
          key={level.label}
          type="button"
          onClick={() => onChange(level.label)}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
            value === level.label
              ? `${level.active} text-white shadow-sm`
              : `border-gray-200 text-gray-500 ${level.ring}`
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}
