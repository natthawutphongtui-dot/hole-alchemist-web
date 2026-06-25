"use client"

import { useEffect, useState, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import * as THREE from "three"

function TShirtModel({ color, frontTexture }: {
  color: string
  frontTexture: THREE.Texture | null
}) {
  const { scene } = useGLTF("/shirt.glb")
  const groupRef = useRef<THREE.Group>(null)

  // center model
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.sub(center)
  }, [scene])

  // เปลี่ยนสีเสื้อ
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m: any) => {
            m.color.set(color)
            m.map = null
            m.needsUpdate = true
          })
        } else {
          const m = mesh.material as any
          m.color.set(color)
          m.map = null
          m.needsUpdate = true
        }
      }
    })
  }, [scene, color])

  // คำนวณ bounding box เพื่อวาง plane ลาย
  const box = new THREE.Box3().setFromObject(scene)
  const size = box.getSize(new THREE.Vector3())
  const frontZ = box.max.z + 0.01

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      {/* แปะลายเป็น plane ด้านหน้าเสื้อ */}
      {frontTexture && (
        <mesh position={[0, 0, frontZ]}>
          <planeGeometry args={[size.x * 0.5, size.y * 0.5]} />
          <meshStandardMaterial
            map={frontTexture}
            transparent
            alphaTest={0.05}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  )
}

interface Props {
  shirtColor: string
  designUrls?: Record<string, string>
}

export default function ThreeDPreview({ shirtColor, designUrls }: Props) {
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null)

useEffect(() => {
  if (!designUrls?.["หน้า"]) {
    setFrontTexture(null)
    return
  }

  const img = new window.Image()
  img.crossOrigin = "anonymous"
  img.onload = () => {
    
    const canvas = document.createElement("canvas")
    canvas.width = 4096
    canvas.height = 4096
    const ctx = canvas.getContext("2d")!

    
    ctx.clearRect(0, 0, 4096, 4096)

    
    const destX = 190
    const destY = 190
    const destW = 1560
    const destH = 1300

    ctx.drawImage(img, destX, destY, destW, destH)

    const tex = new THREE.CanvasTexture(canvas)
    tex.flipY = false
    tex.needsUpdate = true
    setFrontTexture(tex)
  }
  img.src = designUrls["หน้า"]
}, [designUrls])

  return (
    <div className="rounded-2xl overflow-hidden" style={{ height: 450, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        shadows
        gl={{ antialias: true }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0, 0)
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-3, 2, 3]} intensity={0.5} />
        <pointLight position={[0, -2, 4]} intensity={0.4} />

        <TShirtModel color={shirtColor} frontTexture={frontTexture} />

        <OrbitControls
          enableZoom
          enablePan={false}
          minDistance={1}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={1.5}
          target={[0, 0, 0]}
        />
      </Canvas>
      <div className="text-center text-xs text-gray-400 py-2" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}>
        ลากเพื่อหมุน · Scroll เพื่อซูม
      </div>
    </div>
  )
}