import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function StarParticles() {
    const points = useRef<THREE.Points>(null!)

    // Create a dense cluster of particles for the star
    const count = 500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
        // Sphere distribution
        const r = Math.random() * 2.0 // Radius of the star
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)

        const x = r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.sin(phi) * Math.sin(theta)
        const z = r * Math.cos(phi)

        positions[i * 3] = x
        positions[i * 3 + 1] = y + 12 // Place on top of the tree (height is 24, so top is 12)
        positions[i * 3 + 2] = z

        // Bright yellow/white colors
        const color = new THREE.Color().setHSL(0.15, 1.0, 0.8 + Math.random() * 0.2)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b

        sizes[i] = Math.random() * 0.5 + 0.5
    }

    useFrame((state) => {
        if (points.current) {
            // Rotate the star
            points.current.rotation.y = state.clock.elapsedTime * 0.5
            points.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
        }
    })

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={colors}
                    itemSize={3}
                    args={[colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={sizes}
                    itemSize={1}
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.5}
                vertexColors
                transparent
                opacity={1}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    )
}
