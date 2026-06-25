interface Props {
  color: string
  view: "หน้า" | "หลัง" | "ซ้าย" | "ขวา"
  width?: number
  height?: number
}

export default function ShirtSVG({ color, view, width = 400, height = 480 }: Props) {
  const stroke = "#cccccc"
  const strokeWidth = 1.5

  if (view === "หน้า" || view === "หลัง") {
    return (
      <svg width={width} height={height} viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg">
        <path
          d="
            M 140 40
            C 155 35 175 30 200 30
            C 225 30 245 35 260 40
            C 275 20 310 30 340 60
            L 370 120
            L 310 145
            L 310 430
            C 310 440 300 450 290 450
            L 110 450
            C 100 450 90 440 90 430
            L 90 145
            L 30 120
            L 60 60
            C 90 30 125 20 140 40
            Z
          "
          fill={color}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {/* คอเสื้อ */}
        <path
          d="
            M 140 40
            C 155 55 170 65 200 68
            C 230 65 245 55 260 40
          "
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {view === "หน้า" && (
          <>
            {/* ตะเข็บกลาง */}
            <line x1="200" y1="68" x2="200" y2="450" stroke={stroke} strokeWidth={0.5} strokeDasharray="4,4" opacity="0.4" />
          </>
        )}
      </svg>
    )
  }

  if (view === "ซ้าย" || view === "ขวา") {
    return (
      <svg width={width} height={height} viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg">
        <path
          d="
            M 160 40
            C 175 35 190 32 200 30
            C 240 30 270 40 280 60
            L 310 120
            L 270 140
            L 270 430
            C 270 440 260 450 250 450
            L 150 450
            C 140 450 130 440 130 430
            L 130 140
            L 90 120
            L 120 60
            C 135 35 150 42 160 40
            Z
          "
          fill={color}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {/* คอเสื้อด้านข้าง */}
        <path
          d="M 160 40 C 170 55 185 65 200 68"
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
        {/* ตะเข็บข้าง */}
        <line x1="200" y1="68" x2="200" y2="450" stroke={stroke} strokeWidth={0.5} strokeDasharray="4,4" opacity="0.4" />
      </svg>
    )
  }

  return null
}