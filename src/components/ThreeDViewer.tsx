"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Box, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Maximize2 } from "lucide-react"
import type * as THREE from "three"
import modelData from "@/src/data/3d-models.json"

interface ThreeDViewerProps {
  stepData: {
    highlight: string[]
    exploded: boolean
  }
  isExploded: boolean
  onToggleExploded: () => void
}

// Component parts of the closet
const ClosetPart = ({
  position,
  size,
  color,
  isHighlighted,
  label,
  explodedOffset = [0, 0, 0],
}: {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  isHighlighted: boolean
  label: string
  explodedOffset?: [number, number, number]
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const finalPosition: [number, number, number] = [
    position[0] + explodedOffset[0],
    position[1] + explodedOffset[1],
    position[2] + explodedOffset[2],
  ]

  return (
    <group>
      <Box
        ref={meshRef}
        position={finalPosition}
        args={size}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={isHighlighted ? "#3b82f6" : hovered ? "#60a5fa" : color}
          transparent
          opacity={isHighlighted ? 0.9 : 0.7}
        />
      </Box>
      {(isHighlighted || hovered) && (
        <Text
          position={[finalPosition[0], finalPosition[1] + size[1] / 2 + 0.5, finalPosition[2]]}
          fontSize={0.3}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  )
}

const ClosetModel = ({ stepData, isExploded }: { stepData: any; isExploded: boolean }) => {
  const closetData = modelData.closet

  const parts = [
    {
      name: "back-panel",
      position: [0, 0, -0.5] as [number, number, number],
      size: [3, 3, 0.1] as [number, number, number],
      color: "#8B4513",
      label: "Back Panel",
    },
    {
      name: "side-panels",
      position: [-1.4, 0, 0] as [number, number, number],
      size: [0.1, 3, 1] as [number, number, number],
      color: "#A0522D",
      label: "Side Panels",
    },
    {
      name: "side-panels-right",
      position: [1.4, 0, 0] as [number, number, number],
      size: [0.1, 3, 1] as [number, number, number],
      color: "#A0522D",
      label: "Side Panels",
    },
    {
      name: "shelves",
      position: [0, -0.5, 0.2] as [number, number, number],
      size: [2.6, 0.1, 0.8] as [number, number, number],
      color: "#CD853F",
      label: "Shelves",
    },
    {
      name: "shelves-top",
      position: [0, 1, 0.2] as [number, number, number],
      size: [2.6, 0.1, 0.8] as [number, number, number],
      color: "#CD853F",
      label: "Shelves",
    },
    {
      name: "doors",
      position: [-0.7, 0, 0.5] as [number, number, number],
      size: [1.2, 2.8, 0.1] as [number, number, number],
      color: "#DEB887",
      label: "Left Door",
    },
    {
      name: "doors-right",
      position: [0.7, 0, 0.5] as [number, number, number],
      size: [1.2, 2.8, 0.1] as [number, number, number],
      color: "#DEB887",
      label: "Right Door",
    },
    {
      name: "handles",
      position: [-0.2, 0, 0.51] as [number, number, number],
      size: [0.1, 0.3, 0.05] as [number, number, number],
      color: "#C0C0C0",
      label: "Door Handle",
    },
    {
      name: "handles-right",
      position: [0.2, 0, 0.51] as [number, number, number],
      size: [0.1, 0.3, 0.05] as [number, number, number],
      color: "#C0C0C0",
      label: "Door Handle",
    },
    {
      name: "hanging-rod",
      position: [0, 0.8, 0.2] as [number, number, number],
      size: [2.4, 0.05, 0.05] as [number, number, number],
      color: "#C0C0C0",
      label: "Hanging Rod",
    },
  ]

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      {parts.map((part, index) => {
        const isHighlighted = stepData.highlight.some(
          (highlight: string) => part.name.includes(highlight) || highlight.includes(part.name.split("-")[0]),
        )

        const explodedOffset = isExploded
          ? [part.position[0] * 0.5, part.position[1] * 0.3, part.position[2] * 0.8]
          : [0, 0, 0]

        return (
          <ClosetPart
            key={`${part.name}-${index}`}
            position={part.position}
            size={part.size}
            color={part.color}
            isHighlighted={isHighlighted}
            label={part.label}
            explodedOffset={explodedOffset}
          />
        )
      })}
    </>
  )
}

export function ThreeDViewer({ stepData, isExploded, onToggleExploded }: ThreeDViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const resetCamera = () => {
    // This would reset the camera position in a real implementation
    window.location.reload()
  }

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${isFullscreen ? "fixed inset-0 z-50" : "h-96"}`}>
      <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
        <ClosetModel stepData={stepData} isExploded={isExploded} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 flex gap-2">
        <Button size="sm" variant="secondary" onClick={onToggleExploded}>
          {isExploded ? "Assembled View" : "Exploded View"}
        </Button>
        <Button size="sm" variant="secondary" onClick={resetCamera}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setIsFullscreen(!isFullscreen)}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Highlighted Parts Info */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex flex-wrap gap-2">
          {stepData.highlight.map((part: string) => (
            <Badge key={part} variant="secondary" className="bg-blue-100 text-blue-800">
              {part.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            </Badge>
          ))}
        </div>
      </div>

      {isFullscreen && (
        <Button className="absolute top-4 right-4" variant="secondary" onClick={() => setIsFullscreen(false)}>
          Exit Fullscreen
        </Button>
      )}
    </div>
  )
}
