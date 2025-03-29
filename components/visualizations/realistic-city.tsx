"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// Vehicle component for realistic city
function Vehicle({
  position,
  color = "#ff0000",
  speed = 0.05,
  direction = 1,
}: {
  position: [number, number, number]
  color?: string
  speed?: number
  direction?: number
}) {
  const vehicleRef = useRef<THREE.Group>(null)

  // Create vehicle mesh
  const vehicleMesh = useMemo(() => {
    const group = new THREE.Group()

    // Car body
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.3, 0.4),
      new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.2 }),
    )

    // Car top
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.2, 0.35),
      new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.2 }),
    )
    top.position.y = 0.25

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16)
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: "#111111", metalness: 0.5, roughness: 0.7 })

    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel1.position.set(0.25, -0.15, 0.2)
    wheel1.rotation.z = Math.PI / 2

    const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel2.position.set(0.25, -0.15, -0.2)
    wheel2.rotation.z = Math.PI / 2

    const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel3.position.set(-0.25, -0.15, 0.2)
    wheel3.rotation.z = Math.PI / 2

    const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel4.position.set(-0.25, -0.15, -0.2)
    wheel4.rotation.z = Math.PI / 2

    // Windows
    const windowMaterial = new THREE.MeshStandardMaterial({ color: "#aaddff", metalness: 0.9, roughness: 0.1 })

    const frontWindow = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.34), windowMaterial)
    frontWindow.position.set(0.2, 0.25, 0)

    const backWindow = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.34), windowMaterial)
    backWindow.position.set(-0.2, 0.25, 0)

    // Headlights
    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: "#ffffff",
      emissiveIntensity: 1,
    })

    const headlight1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), headlightMaterial)
    headlight1.position.set(0.4, 0, 0.15)

    const headlight2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), headlightMaterial)
    headlight2.position.set(0.4, 0, -0.15)

    // Add all parts to the group
    group.add(body, top, wheel1, wheel2, wheel3, wheel4, frontWindow, backWindow, headlight1, headlight2)

    // Rotate to face the right direction
    if (direction === -1) {
      group.rotation.y = Math.PI
    }

    return group
  }, [color, direction])

  // Set initial position
  useEffect(() => {
    if (vehicleRef.current) {
      vehicleRef.current.position.set(...position)
    }
  }, [position])

  // Animate the vehicle
  useFrame(() => {
    if (vehicleRef.current) {
      // Move the vehicle
      vehicleRef.current.position.x += speed * direction

      // Reset position when it goes off the road
      if (direction > 0 && vehicleRef.current.position.x > 40) {
        vehicleRef.current.position.x = -40
      } else if (direction < 0 && vehicleRef.current.position.x < -40) {
        vehicleRef.current.position.x = 40
      }
    }
  })

  return <primitive ref={vehicleRef} object={vehicleMesh} />
}

// Pedestrian component
function Pedestrian({
  position,
  speed = 0.02,
  direction = 1,
}: {
  position: [number, number, number]
  speed?: number
  direction?: number
}) {
  const pedestrianRef = useRef<THREE.Group>(null)

  // Create pedestrian mesh
  const pedestrianMesh = useMemo(() => {
    const group = new THREE.Group()

    // Random color for clothing
    const colors = ["#3366cc", "#cc3366", "#66cc33", "#cc6633", "#6633cc"]
    const clothingColor = colors[Math.floor(Math.random() * colors.length)]

    // Body
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.05, 0.1, 2, 8),
      new THREE.MeshStandardMaterial({ color: clothingColor }),
    )
    body.position.y = 0.15

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshStandardMaterial({ color: "#f5d0b0" }),
    )
    head.position.y = 0.3

    // Legs
    const legMaterial = new THREE.MeshStandardMaterial({ color: "#1a1a1a" })

    const leg1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.1, 2, 8), legMaterial)
    leg1.position.set(0.03, -0.05, 0)

    const leg2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.1, 2, 8), legMaterial)
    leg2.position.set(-0.03, -0.05, 0)

    // Add all parts to the group
    group.add(body, head, leg1, leg2)

    // Rotate to face the right direction
    if (direction === -1) {
      group.rotation.y = Math.PI
    }

    return group
  }, [direction])

  // Set initial position
  useEffect(() => {
    if (pedestrianRef.current) {
      pedestrianRef.current.position.set(...position)
    }
  }, [position])

  // Animate the pedestrian
  useFrame(({ clock }) => {
    if (pedestrianRef.current) {
      // Move the pedestrian
      pedestrianRef.current.position.x += speed * direction

      // Add a slight bobbing motion
      pedestrianRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 5) * 0.01

      // Reset position when it goes off the sidewalk
      if (direction > 0 && pedestrianRef.current.position.x > 40) {
        pedestrianRef.current.position.x = -40
      } else if (direction < 0 && pedestrianRef.current.position.x < -40) {
        pedestrianRef.current.position.x = 40
      }
    }
  })

  return <primitive ref={pedestrianRef} object={pedestrianMesh} />
}

// Building component for realistic city
function RealisticBuilding({
  position,
  width = 5,
  depth = 5,
  height = 10,
  timeOfDay = "day",
}: {
  position: [number, number, number]
  width?: number
  depth?: number
  height?: number
  timeOfDay?: string
}) {
  // Generate a realistic building color
  const buildingColor = useMemo(() => {
    const colors = [
      "#d9d0c1", // Beige
      "#c0c5ce", // Light gray
      "#e8e4d9", // Off-white
      "#b5b8c4", // Blue-gray
      "#d1c6b8", // Tan
      "#a3a9b1", // Medium gray
      "#c8d1dc", // Light blue-gray
      "#e5ded3", // Cream
      "#bfb6a8", // Taupe
      "#d6d6d6", // Silver
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }, [])

  // Generate window pattern
  const windowPattern = useMemo(() => {
    // Number of floors and windows per floor
    const floors = Math.floor(height / 2)
    const windowsPerFloor = Math.floor(width * 1.5)

    // Create window pattern
    const pattern = []
    for (let floor = 0; floor < floors; floor++) {
      for (let w = 0; w < windowsPerFloor; w++) {
        // Window position
        const wx = (w / windowsPerFloor - 0.5) * width * 0.9
        const wy = floor * 2 + 1
        const wz = (depth / 2) * 0.99

        // Window size
        const wWidth = 0.4
        const wHeight = 0.6

        // Window lit status (random for night, all off for day)
        const isLit = timeOfDay === "night" ? Math.random() > 0.3 : false

        pattern.push({
          position: [wx, wy, wz],
          size: [wWidth, wHeight, 0.1],
          isLit,
        })

        // Add windows to the other side of the building
        pattern.push({
          position: [wx, wy, -wz],
          size: [wWidth, wHeight, 0.1],
          isLit,
        })

        // Add windows to the sides if the building is wide enough
        if (width > 8 && (w === 0 || w === windowsPerFloor - 1)) {
          const sideWz = (Math.random() - 0.5) * depth * 0.8
          pattern.push({
            position: [(width / 2) * 0.99, wy, sideWz],
            size: [0.1, wHeight, wWidth],
            isLit: timeOfDay === "night" ? Math.random() > 0.3 : false,
          })

          pattern.push({
            position: [(-width / 2) * 0.99, wy, sideWz],
            size: [0.1, wHeight, wWidth],
            isLit: timeOfDay === "night" ? Math.random() > 0.3 : false,
          })
        }
      }
    }

    return pattern
  }, [width, depth, height, timeOfDay])

  return (
    <group position={position}>
      {/* Main building structure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={buildingColor} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Windows */}
      {windowPattern.map((window, index) => (
        <mesh key={index} position={window.position} castShadow>
          <boxGeometry args={window.size} />
          <meshStandardMaterial
            color={window.isLit ? "#ffff99" : "#aaddff"}
            emissive={window.isLit ? "#ffff99" : "#000000"}
            emissiveIntensity={window.isLit ? 1 : 0}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Roof details */}
      <mesh position={[0, height / 2 + 0.25, 0]} castShadow>
        <boxGeometry args={[width * 0.7, 0.5, depth * 0.7]} />
        <meshStandardMaterial color="#a0a0a0" roughness={0.6} />
      </mesh>

      {/* Random roof structures */}
      {Math.random() > 0.5 && (
        <mesh position={[width * 0.2, height / 2 + 1, depth * 0.2]} castShadow>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#909090" roughness={0.7} />
        </mesh>
      )}

      {Math.random() > 0.7 && (
        <mesh position={[-width * 0.15, height / 2 + 0.75, -depth * 0.15]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 1.5, 8]} />
          <meshStandardMaterial color="#808080" roughness={0.6} />
        </mesh>
      )}
    </group>
  )
}

// Road component
function Road({ position = [0, -0.05, 0], width = 80, length = 10 }) {
  return (
    <group position={position}>
      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>

      {/* Road markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[width, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, length / 2 + 2]}>
        <planeGeometry args={[width, 4]} />
        <meshStandardMaterial color="#a0a0a0" roughness={0.7} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -length / 2 - 2]}>
        <planeGeometry args={[width, 4]} />
        <meshStandardMaterial color="#a0a0a0" roughness={0.7} />
      </mesh>
    </group>
  )
}

// Street lamp component
function StreetLamp({ position, timeOfDay = "day" }: { position: [number, number, number]; timeOfDay?: string }) {
  const isLit = timeOfDay === "night" || timeOfDay === "sunset" || timeOfDay === "sunrise"

  return (
    <group position={position}>
      {/* Lamp post */}
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
        <meshStandardMaterial color="#505050" roughness={0.7} />
      </mesh>

      {/* Lamp arm */}
      <mesh position={[0.5, 1.4, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#505050" roughness={0.7} />
      </mesh>

      {/* Lamp head */}
      <mesh position={[1, 1.4, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.3]} />
        <meshStandardMaterial color="#303030" roughness={0.6} />
      </mesh>

      {/* Lamp light */}
      <mesh position={[1, 1.3, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={isLit ? "#ffffff" : "#000000"}
          emissiveIntensity={isLit ? 1 : 0}
        />
      </mesh>

      {/* Light source */}
      {isLit && <pointLight position={[1, 1.3, 0]} intensity={0.8} distance={10} decay={2} color="#fffadd" />}
    </group>
  )
}

// Tree component
function StreetTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {/* Tree foliage */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#2e8b57" roughness={0.8} />
      </mesh>
    </group>
  )
}

// Main RealisticCity component
export function RealisticCity({ timeOfDay = "day" }: { timeOfDay?: string }) {
  const { scene } = useThree()

  // Generate city layout - but only include roads and lamps, not random buildings
  const cityLayout = useMemo(() => {
    // No random buildings, only include infrastructure

    // Street lamps
    const lamps = []
    const lampCount = 16

    for (let i = 0; i < lampCount; i++) {
      const x = -35 + i * 5
      lamps.push({
        position: [x, 0, 7],
      })

      // Add lamps to the other side of the road
      lamps.push({
        position: [x, 0, -7],
      })
    }

    // Vehicles
    const vehicles = []
    const vehicleCount = 10

    for (let i = 0; i < vehicleCount; i++) {
      const x = -35 + Math.random() * 70
      const lane = Math.random() > 0.5 ? 2 : -2
      const direction = lane > 0 ? 1 : -1
      const speed = 0.05 + Math.random() * 0.1

      // Random car color
      const colors = ["#ff0000", "#0000ff", "#ffff00", "#00ff00", "#ffffff", "#000000", "#ff00ff", "#00ffff"]
      const color = colors[Math.floor(Math.random() * colors.length)]

      vehicles.push({
        position: [x, 0.3, lane],
        color,
        speed,
        direction,
      })
    }

    // Pedestrians
    const pedestrians = []
    const pedestrianCount = 15

    for (let i = 0; i < pedestrianCount; i++) {
      const x = -35 + Math.random() * 70
      const side = Math.random() > 0.5 ? 1 : -1
      const offset = Math.random() * 2
      const z = side * (9 + offset)
      const direction = Math.random() > 0.5 ? 1 : -1
      const speed = 0.01 + Math.random() * 0.03

      pedestrians.push({
        position: [x, 0, z],
        speed,
        direction,
      })
    }

    // Return layout without buildings
    return { buildings: [], lamps, vehicles, pedestrians }
  }, [])

  return (
    <group>
      {/* Road */}
      <Road />

      {/* No buildings - they will be represented by contribution data */}

      {/* Street lamps */}
      {cityLayout.lamps.map((lamp, index) => (
        <StreetLamp key={`lamp-${index}`} position={lamp.position as [number, number, number]} timeOfDay={timeOfDay} />
      ))}

      {/* Vehicles */}
      {cityLayout.vehicles.map((vehicle, index) => (
        <Vehicle
          key={`vehicle-${index}`}
          position={vehicle.position as [number, number, number]}
          color={vehicle.color}
          speed={vehicle.speed}
          direction={vehicle.direction}
        />
      ))}

      {/* Pedestrians */}
      {cityLayout.pedestrians.map((pedestrian, index) => (
        <Pedestrian
          key={`pedestrian-${index}`}
          position={pedestrian.position as [number, number, number]}
          speed={pedestrian.speed}
          direction={pedestrian.direction}
        />
      ))}
    </group>
  )
}

