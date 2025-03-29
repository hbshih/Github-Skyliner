"use client"

import { useEffect, useState } from "react"

interface Particle {
  x: number
  y: number
  size: number
  color: string
  velocity: {
    x: number
    y: number
  }
  rotation: number
  rotationSpeed: number
}

export function ConfettiEffect() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show confetti after a short delay
    const timer = setTimeout(() => {
      setShow(true)

      // Hide after animation completes
      setTimeout(() => {
        setShow(false)
      }, 4000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!show) return

    const canvas = document.createElement("canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.position = "fixed"
    canvas.style.top = "0"
    canvas.style.left = "0"
    canvas.style.pointerEvents = "none"
    canvas.style.zIndex = "9999"
    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create particles
    const particles: Particle[] = []
    const colors = ["#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#007aff", "#5856d6", "#af52de"]

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: -2 + Math.random() * 4,
          y: 2 + Math.random() * 6,
        },
        rotation: Math.random() * 360,
        rotationSpeed: -4 + Math.random() * 8,
      })
    }

    // Animation loop
    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let complete = true

      particles.forEach((particle) => {
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate((particle.rotation * Math.PI) / 180)

        // Draw confetti piece
        ctx.fillStyle = particle.color
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size / 2)

        // Update position
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y

        // Add gravity
        particle.velocity.y += 0.1

        // Add rotation
        particle.rotation += particle.rotationSpeed

        // Add drag
        particle.velocity.x *= 0.99

        // Check if animation should continue
        if (particle.y < canvas.height + 100) {
          complete = false
        }

        ctx.restore()
      })

      if (complete) {
        cancelAnimationFrame(animationFrame)
        document.body.removeChild(canvas)
      } else {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas)
      }
    }
  }, [show])

  return null
}

