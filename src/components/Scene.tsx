import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { TreeParticles } from './TreeParticles'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

interface SceneProps {
    disperse: number
}

export default function Scene({ disperse }: SceneProps) {
    return (
        <Canvas className="w-full h-full" shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 40]} fov={50} />
            <OrbitControls makeDefault />

            <color attach="background" args={['#000500']} />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} castShadow />

            <TreeParticles disperse={disperse} />

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.4} />
            </EffectComposer>
        </Canvas>
    )
}
