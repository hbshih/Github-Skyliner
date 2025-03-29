"use client"

import React, { forwardRef } from 'react'
import { Text as DreiText } from '@react-three/drei'
import * as THREE from 'three'

// Create a wrapper component that prevents shadow-related operations
const SafeText = forwardRef(function SafeText(props: any, ref: any) {
  // Clone the props and remove any shadow-related properties
  const safeProps = { ...props }
  
  // Explicitly prevent shadow features
  safeProps.castShadow = false
  safeProps.receiveShadow = false
  
  // Use a React.memo to optimize renders
  return <DreiText {...safeProps} ref={ref} />
})

export { SafeText }
