interface Fabric {
  name: string
  desc: string
}

interface Props {
  fabrics: Fabric[]
  selected: string
  onChange: (fabric: string) => void
}

export default function FabricSelector({ fabrics, selected, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h3 className="font-bold text-gray-900 mb-4">เนื้อผ้า</h3>
      <div className="flex flex-col gap-2">
        {fabrics.map((fabric) => (
          <button
            key={fabric.name}
            onClick={() => onChange(fabric.name)}
            className={`flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
              selected === fabric.name
                ? "border-black bg-gray-50"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{fabric.name}</p>
              <p className="text-xs text-gray-400">{fabric.desc}</p>
            </div>
            {selected === fabric.name && (
              <span className="text-black text-lg">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}