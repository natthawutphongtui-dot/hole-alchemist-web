"use client"

import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Stage, Layer, Text, Transformer, Image as KonvaImg } from "react-konva"
import ShirtSVG from "./ShirtSVG"

interface Props {
  shirtColor: string
  view: string
}

interface TextItem {
  id: string
  type: "text"
  text: string
  x: number
  y: number
  fontSize: number
  fill: string
  fontStyle: string
  fontFamily: string
}

interface ImageItem {
  id: string
  type: "image"
  url: string
  x: number
  y: number
  width: number
  height: number
}

type DesignItem = TextItem | ImageItem

const FONTS = [
  { name: "Kanit", label: "Kanit" },
  { name: "Sarabun", label: "Sarabun" },
  { name: "Prompt", label: "Prompt" },
  { name: "Mitr", label: "Mitr" },
  { name: "Chakra Petch", label: "Chakra Petch" },
  { name: "IBM Plex Sans Thai", label: "IBM Plex" },
  { name: "Arial", label: "Arial" },
  { name: "Georgia", label: "Georgia" },
]

function KonvaImageItem({ item, onSelect, onChange }: {
  item: ImageItem
  onSelect: () => void
  onChange: (attrs: Partial<ImageItem>) => void
}) {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.src = item.url
    img.onload = () => setImage(img)
  }, [item.url])

  if (!image) return null

  return (
    <KonvaImg
      id={item.id}
      image={image}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onTransformEnd={(e) => {
        onChange({
          x: e.target.x(),
          y: e.target.y(),
          width: e.target.width() * e.target.scaleX(),
          height: e.target.height() * e.target.scaleY(),
        })
        e.target.scaleX(1)
        e.target.scaleY(1)
      }}
    />
  )
}

const CanvasEditor = forwardRef(function CanvasEditor(
  { shirtColor, view }: Props,
  ref
) {
  const stageRef = useRef<any>(null)
  const transformerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [items, setItems] = useState<Record<string, DesignItem[]>>({
    หน้า: [],
    หลัง: [],
    ซ้าย: [],
    ขวา: [],
  })
  const [fontFamily, setFontFamily] = useState("Kanit")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addingText, setAddingText] = useState(false)
  const [newText, setNewText] = useState("")
  const [textColor, setTextColor] = useState("#000000")
  const [fontSize, setFontSize] = useState(24)
  const [uploadingImage, setUploadingImage] = useState(false)

  const currentItems = items[view] ?? []

  useImperativeHandle(ref, () => ({
    exportAllViews: async () => {
      const views = ["หน้า", "หลัง", "ซ้าย", "ขวา"]
      const results: Record<string, string> = {}

      for (const v of views) {
        if ((items[v] ?? []).length === 0) continue

        const tempItems = items[v]
        const Konva = (await import("konva")).default
        const container = document.createElement("div")
        document.body.appendChild(container)

        const offscreen = new Konva.Stage({
          container,
          width: 400,
          height: 480,
        })
        const layer = new Konva.Layer()
        offscreen.add(layer)

        for (const item of tempItems) {
          if (item.type === "text") {
            const t = item as TextItem
            const text = new Konva.Text({
              text: t.text,
              x: t.x,
              y: t.y,
              fontSize: t.fontSize,
              fill: t.fill,
              fontFamily: t.fontFamily,
            })
            layer.add(text)
          } else if (item.type === "image") {
            const imgItem = item as ImageItem
            const img = new window.Image()
            img.crossOrigin = "anonymous"
            await new Promise((resolve) => {
              img.onload = resolve
              img.src = imgItem.url
            })
            const konvaImg = new Konva.Image({
              image: img,
              x: imgItem.x,
              y: imgItem.y,
              width: imgItem.width,
              height: imgItem.height,
            })
            layer.add(konvaImg)
          }
        }

        layer.draw()
        results[v] = offscreen.toDataURL({ pixelRatio: 2 })
        offscreen.destroy()
        document.body.removeChild(container)
      }

      return results
    },
  }))

  useEffect(() => {
    setSelectedId(null)
  }, [view])

  useEffect(() => {
    if (transformerRef.current) {
      if (selectedId) {
        const stage = stageRef.current
        const selectedNode = stage?.findOne(`#${selectedId}`)
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode])
          transformerRef.current.getLayer()?.batchDraw()
        }
      } else {
        transformerRef.current.nodes([])
      }
    }
  }, [selectedId])

  const addText = () => {
    if (!newText.trim()) return
    const newItem: TextItem = {
      id: `text-${Date.now()}`,
      type: "text",
      text: newText,
      x: 130,
      y: 180,
      fontSize,
      fill: textColor,
      fontStyle: "normal",
      fontFamily,
    }
    setItems((prev) => ({
      ...prev,
      [view]: [...(prev[view] ?? []), newItem] as DesignItem[],
    }))
    setNewText("")
    setAddingText(false)
  }

  const deleteSelected = () => {
    if (!selectedId) return
    setItems((prev) => ({
      ...prev,
      [view]: prev[view].filter((item) => item.id !== selectedId) as DesignItem[],
    }))
    setSelectedId(null)
  }

  const updateItem = (id: string, newAttrs: Partial<DesignItem>) => {
    setItems((prev) => ({
      ...prev,
      [view]: prev[view].map((item) =>
        item.id === id ? { ...item, ...newAttrs } as DesignItem : item
      ) as DesignItem[],
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      const newImage: ImageItem = {
        id: `image-${Date.now()}`,
        type: "image",
        url: data.url,
        x: 130,
        y: 150,
        width: 100,
        height: 100,
      }
      setItems((prev) => ({
        ...prev,
        [view]: [...(prev[view] ?? []), newImage] as DesignItem[],
      }))
    } catch {
      alert("อัปโหลดรูปไม่สำเร็จ")
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <button
          onClick={() => setAddingText(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + เพิ่มข้อความ
        </button>

        <div className="relative">
          <button
            onClick={() => document.getElementById("logoInput")?.click()}
            disabled={uploadingImage}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {uploadingImage ? "กำลังอัปโหลด..." : "🖼️ เพิ่มรูป/โลโก้"}
          </button>
          <input
            id="logoInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {selectedId && (
          <button
            onClick={deleteSelected}
            className="px-4 py-2 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors ml-auto"
          >
            ลบที่เลือก
          </button>
        )}
      </div>

      {addingText && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black"
            onKeyDown={(e) => e.key === "Enter" && addText()}
            autoFocus
          />
          <div className="flex items-center gap-1">
            <label className="text-xs text-gray-500">สี</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-200"
            />
          </div>
          <div className="flex items-center gap-1">
            <label className="text-xs text-gray-500">ขนาด</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16 border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-black"
              min={10}
              max={72}
            />
          </div>
          <div className="flex items-center gap-1">
            <label className="text-xs text-gray-500">Font</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="border border-gray-200 rounded-xl px-2 py-2 text-sm focus:outline-none focus:border-black"
            >
              {FONTS.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={addText}
            className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            เพิ่ม
          </button>
          <button
            onClick={() => setAddingText(false)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-4">
        <div ref={containerRef} className="relative" style={{ width: 400, height: 480 }}>
          <div className="absolute inset-0">
            <ShirtSVG color={shirtColor} view={view as any} width={400} height={480} />
          </div>
          <div className="absolute inset-0">
            <Stage
              ref={stageRef}
              width={400}
              height={480}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) {
                  setSelectedId(null)
                }
              }}
            >
              <Layer>
                {currentItems.map((item) => {
                  if (item.type === "image") {
                    return (
                      <KonvaImageItem
                        key={item.id}
                        item={item as ImageItem}
                        onSelect={() => setSelectedId(item.id)}
                        onChange={(attrs) => updateItem(item.id, attrs)}
                      />
                    )
                  }
                  return (
                    <Text
                      key={item.id}
                      id={item.id}
                      text={(item as TextItem).text}
                      x={item.x}
                      y={item.y}
                      fontSize={(item as TextItem).fontSize}
                      fill={(item as TextItem).fill}
                      fontFamily={(item as TextItem).fontFamily}
                      draggable
                      onClick={() => setSelectedId(item.id)}
                      onTap={() => setSelectedId(item.id)}
                      onDragEnd={(e) => {
                        updateItem(item.id, {
                          x: e.target.x(),
                          y: e.target.y(),
                        })
                      }}
                    />
                  )
                })}
                <Transformer ref={transformerRef} />
              </Layer>
            </Stage>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
            {view}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">คลิกที่ข้อความหรือรูปเพื่อเลือก แล้วลากเพื่อย้ายตำแหน่ง</p>
    </div>
  )
})

export default CanvasEditor