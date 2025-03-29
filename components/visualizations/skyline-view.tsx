"use client"

import { useMemo } from "react"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Cloud, Stars, Sky, Environment } from "@react-three/drei"
import { Html } from "@react-three/drei"
import * as THREE from "three"
import type { ContributionDay } from "@/app/actions/github"
import { useVisualization } from "@/contexts/visualization-context"

// Import the RealisticCity component
import { RealisticCity } from "./realistic-city"

// Import removed as it's already included above

interface SkylineViewProps {
  contributions: ContributionDay[]
  height?: number
  username?: string
  showDataLabels?: boolean
  showGridLines?: boolean
  showLegend?: boolean
  is3DEnabled?: boolean
  animate?: boolean
  border?: string
  background?: string
}

// Color theme mapping for skyline elements
interface SkylineColors {
  grid: string
  floor: string
  sun: string
  spotlightA: string
  spotlightB: string
  fog: string
  text: string
}

// Define color themes for different palettes
const getSkylineColors = (palette: string): SkylineColors => {
  switch (palette) {
    case "synthwave":
      return {
        grid: "#ff00ff",
        floor: "#120038",
        sun: "#ff0066",
        spotlightA: "#ff00ff",
        spotlightB: "#00ffff",
        fog: "#120038",
        text: "#ff00ff",
      }
    case "cyberpunk":
      return {
        grid: "#ffd319",
        floor: "#0d0221",
        sun: "#ff2975",
        spotlightA: "#f222ff",
        spotlightB: "#8c1eff",
        fog: "#0d0221",
        text: "#ffd319",
      }
    case "neon":
      return {
        grid: "#00ffff",
        floor: "#000033",
        sun: "#0066ff",
        spotlightA: "#00ccff",
        spotlightB: "#0099ff",
        fog: "#000033",
        text: "#00ffff",
      }
    case "gradient":
      return {
        grid: "#9c55af",
        floor: "#1a0b2e",
        sun: "#7928ca",
        spotlightA: "#8a3ebd",
        spotlightB: "#ad6ba2",
        fog: "#1a0b2e",
        text: "#9c55af",
      }
    case "holographic":
      return {
        grid: "#63a4ff",
        floor: "#0a192f",
        sun: "#db49d8",
        spotlightA: "#83eaf1",
        spotlightB: "#9d63ff",
        fog: "#0a192f",
        text: "#83eaf1",
      }
    case "sunset":
      return {
        grid: "#feb47b",
        floor: "#1f1013",
        sun: "#ff7e5f",
        spotlightA: "#ffcda5",
        spotlightB: "#ffd8be",
        fog: "#1f1013",
        text: "#feb47b",
      }
    case "ocean":
      return {
        grid: "#27476e",
        floor: "#0a1128",
        sun: "#006992",
        spotlightA: "#001d4a",
        spotlightB: "#006992",
        fog: "#0a1128",
        text: "#27476e",
      }
    case "default":
      return {
        grid: "#ff6b61",
        floor: "#121212",
        sun: "#ff3b30",
        spotlightA: "#ff9c92",
        spotlightB: "#ffcdc8",
        fog: "#121212",
        text: "#ff6b61",
      }
    case "github":
      return {
        grid: "#40c463",
        floor: "#0d1117",
        sun: "#9be9a8",
        spotlightA: "#30a14e",
        spotlightB: "#216e39",
        fog: "#0d1117",
        text: "#40c463",
      }
    case "pastel":
      return {
        grid: "#ffd6a5",
        floor: "#f0f0f0",
        sun: "#ffb5b5",
        spotlightA: "#fdffb6",
        spotlightB: "#caffbf",
        fog: "#f0f0f0",
        text: "#ffb5b5",
      }
    case "monochrome":
      return {
        grid: "#4a4a4a",
        floor: "#121212",
        sun: "#6a6a6a",
        spotlightA: "#2a2a2a",
        spotlightB: "#8a8a8a",
        fog: "#121212",
        text: "#8a8a8a",
      }
    case "aurora":
      return {
        grid: "#00ff87",
        floor: "#121212",
        sun: "#60efff",
        spotlightA: "#0061ff",
        spotlightB: "#0f1f61",
        fog: "#121212",
        text: "#00ff87",
      }
    case "cosmic":
      return {
        grid: "#4361ee",
        floor: "#121212",
        sun: "#7209b7",
        spotlightA: "#3a0ca3",
        spotlightB: "#4cc9f0",
        fog: "#121212",
        text: "#4361ee",
      }
    case "emerald":
      return {
        grid: "#006400",
        floor: "#121212",
        sun: "#008000",
        spotlightA: "#004b23",
        spotlightB: "#007200",
        fog: "#121212",
        text: "#006400",
      }
    case "ruby":
      return {
        grid: "#a4133c",
        floor: "#121212",
        sun: "#c9184a",
        spotlightA: "#590d22",
        spotlightB: "#800f2f",
        fog: "#121212",
        text: "#a4133c",
      }
    case "sapphire":
      return {
        grid: "#0077b6",
        floor: "#121212",
        sun: "#0096c7",
        spotlightA: "#03045e",
        spotlightB: "#023e8a",
        fog: "#121212",
        text: "#0077b6",
      }
    default:
      return {
        grid: "#ff00ff",
        floor: "#120038",
        sun: "#ff0066",
        spotlightA: "#ff00ff",
        spotlightB: "#00ffff",
        fog: "#120038",
        text: "#ff00ff",
      }
  }
}

// Weather effects component
function WeatherEffects({
  weather,
  timeOfDay,
  fogDensity,
}: { weather: string; timeOfDay: string; fogDensity: number }) {
  const { scene } = useThree()

  useEffect(() => {
    // Set fog based on weather and density
    if (weather === "foggy" || weather === "cloudy") {
      scene.fog = new THREE.FogExp2(timeOfDay === "night" ? "#0a0a0a" : "#e0e0e0", 0.01 * (fogDensity / 100))
    } else if (weather === "rainy" || weather === "snowy") {
      scene.fog = new THREE.FogExp2(timeOfDay === "night" ? "#0a0a0a" : "#c0c0c0", 0.005 * (fogDensity / 100))
    } else {
      scene.fog = new THREE.FogExp2(timeOfDay === "night" ? "#0a0a0a" : "#ffffff", 0.002 * (fogDensity / 100))
    }

    return () => {
      scene.fog = null
    }
  }, [scene, weather, timeOfDay, fogDensity])

  // Render clouds based on weather
  if (weather === "cloudy" || weather === "rainy" || weather === "snowy" || weather === "foggy") {
    return (
      <>
        <Cloud
          position={[0, 20, -10]}
          opacity={weather === "foggy" ? 0.8 : 0.6}
          speed={0.4}
          width={weather === "foggy" ? 30 : 20}
          depth={weather === "foggy" ? 5 : 2}
          segments={20}
        />
        <Cloud
          position={[-10, 15, -5]}
          opacity={weather === "foggy" ? 0.7 : 0.5}
          speed={0.3}
          width={weather === "foggy" ? 25 : 15}
          depth={weather === "foggy" ? 4 : 2}
          segments={15}
        />
        <Cloud
          position={[10, 18, -8]}
          opacity={weather === "foggy" ? 0.9 : 0.7}
          speed={0.5}
          width={weather === "foggy" ? 35 : 18}
          depth={weather === "foggy" ? 6 : 3}
          segments={25}
        />

        {/* Add rain or snow particles if needed */}
        {(weather === "rainy" || weather === "snowy") && <Particles weather={weather} />}
      </>
    )
  }

  return null
}

// Particles for rain or snow
function Particles({ weather }: { weather: string }) {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 1000

  // Create particles
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = Math.random() * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    return positions
  }, [particleCount])

  // Animate particles
  useFrame(() => {
    if (!particlesRef.current) return

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      // Update y position (falling)
      positions[i * 3 + 1] -= weather === "rainy" ? 0.3 : 0.05

      // If snow, add some horizontal movement
      if (weather === "snowy") {
        positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.01
        positions[i * 3 + 2] += Math.cos(Date.now() * 0.0015 + i) * 0.01
      }

      // Reset particles that fall below the ground
      if (positions[i * 3 + 1] < 0) {
        positions[i * 3] = (Math.random() - 0.5) * 100
        positions[i * 3 + 1] = 50
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={weather === "rainy" ? 0.1 : 0.3}
        color={weather === "rainy" ? "#aaddff" : "#ffffff"}
        transparent
        opacity={0.8}
      />
    </points>
  )
}

// Replace the EnvironmentElements function with this implementation that doesn't rely on external models

// Environment based on selection
function EnvironmentElements({
  environment,
  timeOfDay,
  cityStyle = "stylized",
}: {
  environment: string
  timeOfDay: string
  cityStyle?: string
}) {
  // Create a ref for the group to maintain stable positioning
  const groupRef = useRef<THREE.Group>(null)

  // Position models based on environment
  switch (environment) {
    case "nature":
      return (
        <group ref={groupRef}>
          {/* Add trees around the scene using simple cone and cylinder geometries with fixed positions */}
          {Array.from({ length: 10 }).map((_, i) => {
            // Use a deterministic position calculation instead of random
            const angle = (i / 10) * Math.PI * 2
            const radius = 30 + (i % 3) * 5
            const posX = Math.cos(angle) * radius
            const posZ = Math.sin(angle) * radius
            const scale = 0.5 + (i % 5) * 0.1

            return (
              <group key={i} position={[posX, 0, posZ]} scale={[scale, scale, scale]}>
                {/* Tree trunk */}
                <mesh position={[0, 1, 0]} castShadow>
                  <cylinderGeometry args={[0.3, 0.5, 2, 8]} />
                  <meshStandardMaterial color="#8B4513" />
                </mesh>
                {/* Tree foliage */}
                <mesh position={[0, 3, 0]} castShadow>
                  <coneGeometry args={[2, 4, 8]} />
                  <meshStandardMaterial color={timeOfDay === "night" ? "#0a3200" : "#2e8b57"} />
                </mesh>
              </group>
            )
          })}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color={timeOfDay === "night" ? "#0a3200" : "#1a6300"} />
          </mesh>
        </group>
      )

    case "desert":
      return (
        <group ref={groupRef}>
          {/* Add cacti using simple geometries with fixed positions */}
          {Array.from({ length: 8 }).map((_, i) => {
            // Use a deterministic position calculation
            const angle = (i / 8) * Math.PI * 2
            const radius = 25 + (i % 4) * 5
            const posX = Math.cos(angle) * radius
            const posZ = Math.sin(angle) * radius
            const scale = 0.3 + (i % 3) * 0.1

            return (
              <group key={i} position={[posX, 0, posZ]} scale={[scale, scale, scale]}>
                {/* Cactus main body */}
                <mesh position={[0, 1.5, 0]} castShadow>
                  <cylinderGeometry args={[0.5, 0.7, 3, 8]} />
                  <meshStandardMaterial color="#2F4F4F" />
                </mesh>
                {/* Cactus arms */}
                <mesh position={[0.8, 2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                  <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
                  <meshStandardMaterial color="#2F4F4F" />
                </mesh>
                <mesh position={[-0.8, 1.8, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
                  <cylinderGeometry args={[0.3, 0.3, 1.2, 8]} />
                  <meshStandardMaterial color="#2F4F4F" />
                </mesh>
              </group>
            )
          })}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color={timeOfDay === "night" ? "#5a4a30" : "#d9c2a0"} />
          </mesh>
        </group>
      )

    case "space":
      return (
        <group ref={groupRef}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#000000" emissive="#000033" emissiveIntensity={0.2} />
          </mesh>

          {/* Add some floating asteroids with fixed positions */}
          {Array.from({ length: 15 }).map((_, i) => {
            // Use a deterministic position calculation
            const angle = (i / 15) * Math.PI * 2
            const heightFactor = (i % 5) * 4
            const radius = 40 + (i % 3) * 10
            const posX = Math.cos(angle) * radius
            const posY = 5 + heightFactor
            const posZ = Math.sin(angle) * radius
            const scale = 0.2 + (i % 4) * 0.2

            return (
              <mesh key={i} position={[posX, posY, posZ]} scale={[scale, scale, scale]} castShadow>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#444444" roughness={0.9} />
              </mesh>
            )
          })}
        </group>
      )

    case "city":
    default:
      // Use the realistic city if selected
      if (cityStyle === "realistic") {
        return <RealisticCity timeOfDay={timeOfDay} />
      }

      // Otherwise use a clean city floor without random buildings
      return (
        <group ref={groupRef}>
          {/* Just add the ground plane without random buildings */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color={timeOfDay === "night" ? "#1a1a1a" : "#555555"} />
          </mesh>
        </group>
      )
  }
}

// Time of day lighting
function TimeOfDayLighting({ timeOfDay }: { timeOfDay: string }) {
  const { scene } = useThree()

  useEffect(() => {
    // Set scene background based on time of day
    switch (timeOfDay) {
      case "day":
        scene.background = new THREE.Color("#87ceeb")
        break
      case "sunset":
        scene.background = new THREE.Color("#ff7e5f")
        break
      case "night":
        scene.background = new THREE.Color("#0a0a20")
        break
      case "sunrise":
        scene.background = new THREE.Color("#ffd6a5")
        break
      default:
        scene.background = new THREE.Color("#0a0a20")
    }
  }, [scene, timeOfDay])

  // Return appropriate lighting
  switch (timeOfDay) {
    case "day":
      return (
        <>
          <ambientLight intensity={1.0} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
          <Sky sunPosition={[0, 1, 0]} />
        </>
      )
    case "sunset":
      return (
        <>
          <ambientLight intensity={0.7} color="#ff7e5f" />
          <directionalLight position={[-10, 5, 10]} intensity={1.2} color="#ff7e5f" castShadow />
          <Sky sunPosition={[-1, 0.1, 0]} />
        </>
      )
    case "night":
      return (
        <>
          <ambientLight intensity={0.3} color="#0a0a20" />
          <directionalLight position={[0, 10, 0]} intensity={0.5} color="#b0c4de" castShadow />
          <spotLight position={[-20, 10, 10]} angle={0.3} penumbra={1} intensity={0.5} color="#4169e1" />
          <spotLight position={[20, 10, 10]} angle={0.3} penumbra={1} intensity={0.5} color="#9370db" />
        </>
      )
    case "sunrise":
      return (
        <>
          <ambientLight intensity={0.6} color="#ffd6a5" />
          <directionalLight position={[10, 5, 10]} intensity={1.0} color="#ffd6a5" castShadow />
          <Sky sunPosition={[1, 0.1, 0]} />
        </>
      )
    default:
      return (
        <>
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 20, 10]} intensity={0.5} castShadow />
        </>
      )
  }
}

// Grid component for the synthwave floor
function SynthwaveGrid({ colors, showGridLines = true }: { colors: SkylineColors; showGridLines?: boolean }) {
  const gridRef = useRef<THREE.GridHelper>(null)

  useFrame(({ clock }) => {
    if (gridRef.current) {
      // Subtle animation for the grid
      gridRef.current.position.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.2
    }
  })

  return (
    <>
      {/* Horizontal grid */}
      {showGridLines && <gridHelper ref={gridRef} args={[100, 50, colors.grid, colors.grid]} position={[0, -0.1, 0]} />}

      {/* Glowing floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={colors.floor} emissive={colors.floor} emissiveIntensity={0.5} />
      </mesh>
    </>
  )
}

// Contribution buildings
function ContributionBuildings({
  data,
  colorPalette,
  username,
  colors,
  showDataLabels = false,
  animate = true,
  is3DEnabled = true,
  buildingStyle = "modern",
  reflections = true,
  setHoveredDay,
}: {
  data: ContributionDay[]
  colorPalette: string
  username: string
  colors: SkylineColors
  showDataLabels?: boolean
  animate?: boolean
  is3DEnabled?: boolean
  buildingStyle?: string
  reflections?: boolean
  setHoveredDay: (day: ContributionDay | null) => void
}) {
  const { getContributionColor } = useVisualization()
  const groupRef = useRef<THREE.Group>(null)

  // Calculate max contribution for scaling
  const maxContribution = Math.max(...data.map((day) => day.count || 0), 1)

  // Get color based on palette
  const getColor = (level: number) => {
    // Use the color palette from the context
    return getContributionColor(level)
  }

  // Calculate total columns (weeks)
  const totalCols = Math.ceil(data.length / 7)

  // Apply 3D rotation effect if enabled
  useFrame(({ clock }) => {
    if (groupRef.current && animate && is3DEnabled) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  // Get building geometry based on style and add hover interaction
  const Building = ({
    day,
    height,
    level,
    position,
  }: { day: ContributionDay; height: number; level: number; position: [number, number, number] }) => {
    const [hovered, setHovered] = useState(false)
    const meshRef = useRef<THREE.Mesh>(null)

    // Handle pointer events
    const onPointerOver = (e: any) => {
      e.stopPropagation()
      setHovered(true)
      setHoveredDay(day)
      document.body.style.cursor = "pointer"
    }

    const onPointerOut = () => {
      setHovered(false)
      setHoveredDay(null)
      document.body.style.cursor = "auto"
    }

    // Scale effect on hover - only apply to the building itself, not its parent group
    useFrame(() => {
      if (meshRef.current) {
        // Only scale the building mesh, not the entire group
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, hovered ? 1.1 : 1, 0.1)
      }
    })

    // Create a separate group for the building to isolate hover effects
    return (
      <group position={position}>
        {/* Building content based on style */}
        {buildingStyle === "retro" ? (
          <>
            <mesh
              ref={meshRef}
              position={[0, height / 2, 0]}
              castShadow
              receiveShadow
              onPointerOver={onPointerOver}
              onPointerOut={onPointerOut}
            >
              <boxGeometry args={[0.8, height, 0.8]} />
              <meshStandardMaterial
                color={getColor(level || 0)}
                emissive={getColor(level || 0)}
                emissiveIntensity={hovered ? 0.8 : 0.5}
                roughness={0.8}
              />
            </mesh>
            {/* Add windows - these won't scale with hover */}
            {height > 1 &&
              Array.from({ length: Math.floor(height) }).map((_, i) => (
                <mesh key={i} position={[0, i + 0.5, 0.41]}>
                  <boxGeometry args={[0.4, 0.3, 0.01]} />
                  <meshStandardMaterial color="#ffff99" emissive="#ffff99" emissiveIntensity={0.8} />
                </mesh>
              ))}
          </>
        ) : buildingStyle === "futuristic" ? (
          <>
            <mesh
              ref={meshRef}
              position={[0, height / 2, 0]}
              castShadow
              receiveShadow
              onPointerOver={onPointerOver}
              onPointerOut={onPointerOut}
            >
              <cylinderGeometry args={[0.4, 0.3, height, 6]} />
              <meshStandardMaterial
                color={getColor(level || 0)}
                emissive={getColor(level || 0)}
                emissiveIntensity={hovered ? 0.8 : 0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Add glowing top - this won't scale with hover */}
            <mesh position={[0, height, 0]} castShadow>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={getColor(level || 0)}
                emissiveIntensity={hovered ? 1.5 : 1.0}
              />
            </mesh>
          </>
        ) : buildingStyle === "pixel" ? (
          // Create a pixelated building with voxels
          Array.from({ length: Math.ceil(height) }).map((_, i) => (
            <mesh
              key={i}
              position={[0, i * 0.5 + 0.25, 0]}
              castShadow
              receiveShadow
              onPointerOver={onPointerOver}
              onPointerOut={onPointerOut}
              ref={i === 0 ? meshRef : undefined} // Only apply scale effect to the bottom block
            >
              <boxGeometry args={[0.8, 0.5, 0.8]} />
              <meshStandardMaterial
                color={getColor(Math.min(level + (Math.floor(i / 2) % 2), 4))}
                emissive={getColor(Math.min(level + (Math.floor(i / 2) % 2), 4))}
                emissiveIntensity={hovered ? 0.6 : 0.3}
              />
            </mesh>
          ))
        ) : buildingStyle === "abstract" ? (
          // Create an abstract shape
          <>
            <mesh
              ref={meshRef}
              position={[0, height / 2, 0]}
              castShadow
              receiveShadow
              onPointerOver={onPointerOver}
              onPointerOut={onPointerOut}
            >
              <octahedronGeometry args={[Math.max(0.4, height * 0.3), 0]} />
              <meshStandardMaterial
                color={getColor(level || 0)}
                emissive={getColor(level || 0)}
                emissiveIntensity={hovered ? 0.8 : 0.5}
                wireframe={level > 2}
              />
            </mesh>
            {level > 1 && (
              <mesh position={[0, height * 0.8, 0]} castShadow>
                <torusGeometry args={[0.3, 0.1, 16, 16]} />
                <meshStandardMaterial
                  color={getColor(Math.min(level + 1, 4))}
                  emissive={getColor(Math.min(level + 1, 4))}
                  emissiveIntensity={hovered ? 1.2 : 0.8}
                />
              </mesh>
            )}
          </>
        ) : buildingStyle === "skyscraper" ? (
          // NYC Skyscraper style
          <group>
            {/* Main building structure */}
            <mesh
              ref={meshRef}
              position={[0, height / 2, 0]}
              castShadow
              receiveShadow
              onPointerOver={onPointerOver}
              onPointerOut={onPointerOut}
            >
              <boxGeometry args={[0.8, height, 0.8]} />
              <meshStandardMaterial
                color={getColor(level || 0)}
                emissive={getColor(level || 0)}
                emissiveIntensity={hovered ? 0.3 : 0.1}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Add detailed windows in a grid pattern */}
            {height > 0.5 &&
              Array.from({ length: Math.floor(height * 4) }).map((_, i) => (
                <group key={`floor-${i}`}>
                  {/* Front windows */}
                  <mesh position={[0, i * 0.25 + 0.125, 0.41]} castShadow>
                    <boxGeometry args={[0.7, 0.2, 0.01]} />
                    <meshStandardMaterial
                      color={Math.random() > 0.3 ? "#ffffe0" : "#87ceeb"}
                      emissive={Math.random() > 0.3 ? "#ffffe0" : "#87ceeb"}
                      emissiveIntensity={0.5}
                      metalness={0.9}
                      roughness={0.1}
                    />
                  </mesh>

                  {/* Back windows */}
                  <mesh position={[0, i * 0.25 + 0.125, -0.41]} castShadow>
                    <boxGeometry args={[0.7, 0.2, 0.01]} />
                    <meshStandardMaterial
                      color={Math.random() > 0.3 ? "#ffffe0" : "#87ceeb"}
                      emissive={Math.random() > 0.3 ? "#ffffe0" : "#87ceeb"}
                      emissiveIntensity={0.5}
                      metalness={0.9}
                      roughness={0.1}
                    />
                  </mesh>

                  {/* Side windows */}
                  <mesh position={[0.41, i * 0.25 + 0.125, 0]} castShadow>
                    <boxGeometry args={[0.01, 0.2, 0.7]} />
                    <meshStandardMaterial
                      color={Math.random() > 0.3 ? "#ffffe0" : "#87ceeb"}
                      emissive={Math.random() > 0.3 ? "#ffffe0" : "#87ceeb"}
                      emissiveIntensity={0.5}
                      metalness={0.9}
                      roughness={0.1}
                    />
                  </mesh>

                  <mesh position={[-0.41, i * 0.25 + 0.125, 0]} castShadow>
                    <boxGeometry args={[0.01, 0.2, 0.7]} />
                    <meshStandardMaterial
                      color={Math.random() > 0.3 ? "#ffffe0" : "#87ceeb"}
                      emissive={Math.random() > 0.3 ? "#ffffe0" : "#87ceeb"}
                      emissiveIntensity={0.5}
                      metalness={0.9}
                      roughness={0.1}
                    />
                  </mesh>
                </group>
              ))}

            {/* Building top features */}
            {height > 3 && (
              <>
                {/* Antenna or spire */}
                <mesh position={[0, height + 0.5, 0]} castShadow>
                  <cylinderGeometry args={[0.02, 0.05, 1, 8]} />
                  <meshStandardMaterial color="#a0a0a0" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* Roof structure */}
                <mesh position={[0, height + 0.1, 0]} castShadow>
                  <boxGeometry args={[0.6, 0.2, 0.6]} />
                  <meshStandardMaterial color="#808080" metalness={0.7} roughness={0.3} />
                </mesh>

                {/* Roof details */}
                <mesh position={[0.2, height + 0.2, 0.2]} castShadow>
                  <boxGeometry args={[0.2, 0.3, 0.2]} />
                  <meshStandardMaterial color="#707070" metalness={0.7} roughness={0.3} />
                </mesh>

                <mesh position={[-0.15, height + 0.25, -0.15]} castShadow>
                  <boxGeometry args={[0.15, 0.4, 0.15]} />
                  <meshStandardMaterial color="#606060" metalness={0.7} roughness={0.3} />
                </mesh>
              </>
            )}
          </group>
        ) : (
          // Default modern style
          <mesh
            ref={meshRef}
            position={[0, height / 2, 0]}
            castShadow
            receiveShadow
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
          >
            <boxGeometry args={[0.8, height, 0.8]} />
            <meshStandardMaterial
              color={getColor(level || 0)}
              emissive={getColor(level || 0)}
              emissiveIntensity={hovered ? 0.8 : 0.5}
              metalness={reflections ? 0.5 : 0}
              roughness={reflections ? 0.2 : 0.8}
            />
          </mesh>
        )}

        {/* Show tooltip on hover */}
        {hovered && showDataLabels && (
          <Html position={[0, height + 0.5, 0]} center style={{ pointerEvents: "none" }}>
            <div className="bg-background p-2 rounded text-xs whitespace-nowrap">
              {day.count} contribution{day.count !== 1 ? "s" : ""}
            </div>
          </Html>
        )}
      </group>
    )
  }

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {data.map((day, index) => {
        if (!day || day.count === undefined) return null

        // Calculate building height based on contribution count
        const height = Math.max(0.1, (day.count / maxContribution) * 10)

        // Position buildings in a grid, 7 days per week
        const col = Math.floor(index / 7)
        const row = index % 7

        // Center the grid
        const xPos = (col - totalCols / 2) * 1.2
        const zPos = (row - 3) * 1.2

        return <Building key={index} day={day} height={height} level={day.level || 0} position={[xPos, 0, zPos]} />
      })}

      {/* Base platform */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[totalCols * 1.2 + 2, 0.1, 9]} />
        <meshStandardMaterial color={colors.floor} />
      </mesh>

      {/* Username text on the platform */}
      <group position={[-totalCols * 0.6 + 1, 0, 4]}>
        <Html transform distanceFactor={10}>
          <div style={{ color: colors.text, fontSize: '16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            @{username || "github"}
          </div>
        </Html>
      </group>

      {/* Year text on the platform */}
      <group position={[totalCols * 0.6 - 1, 0, 4]}>
        <Html transform distanceFactor={10}>
          <div style={{ color: colors.spotlightB, fontSize: '16px', fontWeight: 'bold', whiteSpace: 'nowrap', textAlign: 'right' }}>
            {2024} {/* Use a fixed year instead of dynamic date to avoid hydration issues */}
          </div>
        </Html>
      </group>
    </group>
  )
}

// Camera controller with auto-rotation
const skylineRotationSpeed = 0.5

function CameraController({ animate = true, rotationSpeed = 0.5 }: { animate?: boolean; rotationSpeed?: number }) {
  const { camera, gl } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotateSpeed = rotationSpeed
    }
  }, [rotationSpeed])

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      autoRotate={animate}
      autoRotateSpeed={skylineRotationSpeed}
    />
  )
}

// Main Skyline component
export function SkylineView({
  contributions,
  height = 400,
  username,
  showDataLabels = false,
  showGridLines = true,
  showLegend = true,
  is3DEnabled = true,
  animate = true,
  border = "none",
  background = "solid",
}: SkylineViewProps) {
  const {
    colorPalette,
    skylineWeather,
    skylineTimeOfDay,
    skylineEnvironment,
    skylineFogDensity,
    skylineBuildingStyle,
    skylineCityStyle,
    skylineReflections,
    skylineParticles,
    skylineRotationSpeed,
  } = useVisualization()
  const [localUsername, setLocalUsername] = useState<string>("github")
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null)

  // Get colors for the current palette
  const colors = getSkylineColors(colorPalette)

  // Extract username from URL if available
  useEffect(() => {
    if (username) {
      setLocalUsername(username)
    } else if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const usernameParam = urlParams.get("username")
      if (usernameParam) {
        setLocalUsername(usernameParam)
      }
    }
  }, [username])

  // Ensure we have valid contributions
  if (!contributions || !Array.isArray(contributions) || contributions.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No contribution data available</div>
  }

  // Apply border and background styles
  const containerClasses = `
    relative overflow-hidden rounded-md
    ${border === "solid" ? "border border-border" : ""}
    ${border === "gradient" ? "chart-border-gradient" : ""}
    ${background === "transparent" ? "bg-transparent" : ""}
  `

  // In the return statement, add the hoveredDay state to the ContributionBuildings component
  return (
    <div style={{ height: `${height}px`, width: "100%" }} className={containerClasses}>
      <Canvas id="skyline-canvas">
        {/* Camera setup */}
        <PerspectiveCamera makeDefault position={[0, 15, 25]} fov={50} />
        <CameraController animate={animate} rotationSpeed={skylineRotationSpeed} />

        {/* Time of day lighting */}
        <TimeOfDayLighting timeOfDay={skylineTimeOfDay} />

        {/* Weather effects */}
        <WeatherEffects weather={skylineWeather} timeOfDay={skylineTimeOfDay} fogDensity={skylineFogDensity} />

        {/* Environment elements - pass the cityStyle */}
        <EnvironmentElements
          environment={skylineEnvironment}
          timeOfDay={skylineTimeOfDay}
          cityStyle={skylineCityStyle}
        />

        {/* Scene elements */}
        <SynthwaveGrid colors={colors} showGridLines={showGridLines} />
        <ContributionBuildings
          data={contributions}
          colorPalette={colorPalette}
          username={localUsername}
          colors={colors}
          showDataLabels={showDataLabels}
          animate={animate}
          is3DEnabled={is3DEnabled}
          buildingStyle={skylineBuildingStyle}
          reflections={skylineReflections}
          setHoveredDay={setHoveredDay}
        />

        {/* Particles if enabled */}
        {skylineParticles && <Particles weather={skylineWeather} />}

        {/* Environment map for reflections */}
        {skylineReflections && <Environment preset={skylineTimeOfDay === "night" ? "night" : "city"} />}
      </Canvas>

      {/* Overlay gradient for synthwave effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(0deg, ${colors.fog}cc 0%, ${colors.fog}00 40%, ${colors.fog}00 60%, ${colors.fog}cc 100%)`,
          mixBlendMode: "multiply",
        }}
      />

      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "100% 2px",
        }}
      />

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-2 right-2 bg-background/80 p-2 rounded-md text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.text }}></div>
            <span>Contributions</span>
          </div>
        </div>
      )}

      {/* Hover details */}
      {hoveredDay && (
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-md shadow-lg">
          <div className="text-sm font-medium">
            {new Date(hoveredDay.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-lg font-bold">
            {hoveredDay.count} contribution{hoveredDay.count !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  )
}

