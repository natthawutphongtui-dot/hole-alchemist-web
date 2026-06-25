interface Color {
  name: string
  value: string
}

interface Props {
  colors: Color[]
  selected: string
  onChange: (color: string) => void
}

export default function ColorPicker({ colors, selected, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="font-bold text-gray-900 mb-4">สีเสื้อ</h3>
      <div className="grid grid-cols-3 gap-3">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={`flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${
              selected === color.value
                ? "border-black"
                : "border-transparent hover:border-gray-200"
            }`}
          >
            <div
              className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
              style={{ backgroundColor: color.value }}
            />
            <span className="text-xs text-gray-600">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}