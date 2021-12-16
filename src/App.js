import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Stage, PresentationControls } from '@react-three/drei'

function Model(props) {
  const model = useGLTF('/animated_car/model.glb');
  
  // Here's the animation part
  // ************************* 
  let mixer
  if (model.animations.length) {
      mixer = new THREE.AnimationMixer(model.scene);
      model.animations.forEach(clip => {
          const action = mixer.clipAction(clip)
          action.play();
      });
  }

  useFrame((state, delta) => {
      mixer?.update(delta)
  })
  // *************************

  model.scene.traverse(child => {
      if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.material.side = THREE.FrontSide
      }
  })

  return (
      <primitive 
          object={model.scene}
          scale={props.scale}
      />
  )
}

export default function App() {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }}>
      <color attach="background" args={['#101010']} />
      <fog attach="fog" args={['#101010', 10, 20]} />
      <PresentationControls 
        speed={1.5} 
        global 
        zoom={0.7} 
        polar={[-0.1, Math.PI / 4]}>
        <Stage environment={null} intensity={1} contactShadow={false} shadowBias={-0.0015}>
          <Model scale={1.0} />
        </Stage>
      </PresentationControls>
    </Canvas>
  )
}
