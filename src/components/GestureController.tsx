import { useEffect, useRef, useState } from 'react'
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision'

interface GestureControllerProps {
    onGesture: (gesture: string) => void
}

export function GestureController({ onGesture }: GestureControllerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        let gestureRecognizer: GestureRecognizer | null = null
        let animationFrameId: number

        const startWebcam = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
                )

                gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
                        delegate: 'GPU',
                    },
                    runningMode: 'VIDEO',
                })

                if (videoRef.current) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                    videoRef.current.srcObject = stream
                    videoRef.current.addEventListener('loadeddata', predictWebcam)
                    setLoaded(true)
                }
            } catch (error) {
                console.error('Error starting webcam or loading model:', error)
            }
        }

        const predictWebcam = async () => {
            if (videoRef.current && gestureRecognizer) {
                const nowInMs = Date.now()
                const results = gestureRecognizer.recognizeForVideo(videoRef.current, nowInMs)

                if (results.gestures.length > 0) {
                    const gesture = results.gestures[0][0]
                    // console.log('Gesture:', gesture.categoryName, gesture.score)
                    if (gesture.score > 0.5) {
                        onGesture(gesture.categoryName)
                    }
                }

                animationFrameId = requestAnimationFrame(predictWebcam)
            }
        }

        startWebcam()

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream
                stream.getTracks().forEach(track => track.stop())
            }
            cancelAnimationFrame(animationFrameId)
            if (gestureRecognizer) {
                gestureRecognizer.close()
            }
        }
    }, [onGesture])

    return (
        <div className="absolute bottom-4 right-4 w-48 h-36 bg-black/50 rounded-lg overflow-hidden border border-white/20">
            {!loaded && <div className="absolute inset-0 flex items-center justify-center text-white text-xs">Loading AI...</div>}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover opacity-80 transform scale-x-[-1]"
            />
            <div className="absolute bottom-1 left-2 text-[10px] text-white/80">
                Gestures: Open Palm / Closed Fist
            </div>
        </div>
    )
}
