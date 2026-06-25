# HOLE ALCHEMIST — T-Shirt Shop Progress

## Tech Stack
- Next.js 16 + TypeScript
- Tailwind CSS v3 (tailwind.config.js อยู่ที่ root)
- Firebase (Firestore + Auth + Storage)
- Zustand (cart state + persist)
- Font: Line Seed Sans TH
- Cloudinary (image upload) — .env.local มี keys แล้ว
- Konva.js + react-konva (2D canvas designer)
- React Three Fiber + Three.js + @react-three/drei (3D preview)

## Phase 1 ✅ Phase 2 ✅ UX ✅ — เสร็จหมดแล้ว

## Phase 3 — Custom Designer (เสร็จเกือบหมด)

### ไฟล์ที่ทำเสร็จแล้ว
- app/(shop)/design/page.tsx
- components/designer/CanvasEditor.tsx — exportAllViews()
- components/designer/ColorPicker.tsx
- components/designer/FabricSelector.tsx
- components/designer/ShirtSVG.tsx
- components/designer/ThreeDPreview.tsx
- lib/firebase/submissions.ts
- app/admin/designs/page.tsx

### สิ่งที่ทำงานได้แล้ว ✅
- วางข้อความ/รูป/โลโก้บนเสื้อได้
- เลือก font, สี, ขนาดข้อความ
- เลือกสีเสื้อ + เนื้อผ้า
- ดู 4 view (หน้า/หลัง/ซ้าย/ขวา)
- export ทุก view แยกกัน
- สั่งซื้อเสื้อ custom → checkout → order confirmation
- เสนอขายลายให้ร้าน → admin approve → วางขายได้
- admin เห็นลายทุก view ใน grid 2x2
- 3D Preview ใช้ /public/shirt.glb (oversized t-shirt)
- สีเสื้อเปลี่ยนได้แล้ว ✅
- ลายแสดงบนเสื้อ 3D ได้แล้ว ✅ (แต่ตำแหน่งยังไม่ตรง)

### 3D Preview — ยังต้อง fine-tune 🔄
- UV map ของ model: **front = ซ้ายบน, back = ขวาบน, แขน = ล่าง**
- UV texture ขนาด **4096x4096**
- วิธีที่ใช้: สร้าง CanvasTexture 4096x4096 วางลายที่ตำแหน่ง UV
- ค่าล่าสุด: `destX=190, destY=190, destW=1560, destH=1300`
- **ปัญหา**: ลายยังเล็กและอยู่ต่ำเกินไป ต้อง fine-tune ค่าให้ตรงตำแหน่งหน้าเสื้อ
- วิธีแก้: ปรับ destX, destY, destW, destH ใน useEffect ของ ThreeDPreview.tsx

### ค่าที่ต้องปรับต่อ
จาก UV map ที่เห็น front body อยู่ที่:
- ลองเพิ่ม destW และ destH ให้ใหญ่ขึ้น
- ลองขยับ destY ขึ้นไปด้านบน
- เป้าหมาย: ลายอยู่กลางหน้าเสื้อ ขนาดพอดี

### ยังไม่ได้ทำ
- fine-tune UV position ให้ตรง
- ลายด้านหลัง (back UV ขวาบน: destX=2048+)
- ลายแขน