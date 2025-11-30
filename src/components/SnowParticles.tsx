import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import * as random from 'maath/random/dist/maath-random.esm'

export function SnowParticles({ count = 1000 }) {
    const points = useRef<THREE.Points>(null!)

    const [positions] = useState(() => {
        const pos = new Float32Array(count * 3)
        random.inBox(pos, { sides: [50, 50, 50] })
        return pos
    })

    useFrame((state, delta) => {
        if (points.current) {
            // Rotate the entire snow system slowly
            points.current.rotation.y += delta * 0.05

            // Move particles down
            const positions = points.current.geometry.attributes.position.array as Float32Array
            for (let i = 0; i < count; i++) {
                positions[i * 3 + 1] -= delta * 2.0 // Fall speed

                // Reset if below ground
                if (positions[i * 3 + 1] < -25) {
                    positions[i * 3 + 1] = 25
                }
            }
            points.current.geometry.attributes.position.needsUpdate = true
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
            </bufferGeometry>
            <pointsMaterial
                size={0.2}
                color="#ffffff"
                transparent
                opacity={0.8}
                depthWrite={false}
            />
        </points>
    )
}
