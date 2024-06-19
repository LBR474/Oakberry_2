import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Plane, useHelper } from "@react-three/drei";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { SpotLightHelper } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let bgColor = new THREE.Color(48, 48, 48);

const Spotlight = ({
  color,
  position,
}: {
  color: number;
  position: [number, number, number];
}) => {
  const light = useRef<THREE.SpotLight>(null!);
  useHelper(light, SpotLightHelper, "cyan");

  useEffect(() => {
    const tween = (light: THREE.SpotLight) => {
      new TWEEN.Tween(light)
        .to(
          {
            angle: Math.random() * 0.7 + 0.1,
            penumbra: Math.random() + 1,
          },
          Math.random() * 3000 + 2000
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

      new TWEEN.Tween(light.position)
        .to(
          {
            x: Math.random() * 3 - 1.5,
            y: Math.random() * 1 + 1.5,
            z: Math.random() * 3 - 1.5,
          },
          Math.random() * 3000 + 2000
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    };

    const updateTweens = () => {
      if (light.current) {
        tween(light.current);
      }
      setTimeout(updateTweens, 5000);
    };

    updateTweens();
  }, []);

  return (
    <spotLight
      ref={light}
      color={color}
      intensity={10}
      distance={50}
      angle={0.3}
      penumbra={0.2}
      decay={2}
      castShadow
      position={position}
    />
  );
};

const Box = () => {
  const boxRef = useRef<THREE.Mesh>(null!);
  return (
    <mesh ref={boxRef} position={[0, 0.0, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.3, 0.1, 0.2]} />
      <meshPhongMaterial color="#aaaaaa" />
    </mesh>
  );
};

const Model = () => {
  const gltf = useLoader(GLTFLoader, "Oakberry_7.glb");
  return (
    <primitive
      object={gltf.scene}
      scale={0.1}
      rotation={[0, Math.PI / 1, 0]}
      position={[0, 0.0, 0]}
    />
  );
};

const Scene = () => {
  const { scene, camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 1.2, -2.1);
    camera.lookAt(0, 0.5, 0);
    scene.background = new THREE.Color(0x202020);
  }, [camera, scene]);

  useFrame(() => {
    TWEEN.update();
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <Spotlight color={0xff7f00} position={[1.5, 4, 4.5]} />
      <Spotlight color={0x00ff7f} position={[0, 4, 3.5]} />
      <Spotlight color={0x7f00ff} position={[-1.5, 4, 4.5]} />

      <Plane
        args={[100, 100]}
        rotation-x={-Math.PI / 2}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <meshPhongMaterial attach="material" color="#808080" />
      </Plane>

      <Box />
      <Model />
    </>
  );
};

const App = () => {
  return (
    <Canvas shadows camera={{ position: [4.6, 2.2, -2.1], fov: 35 }}>
      <color attach="background" args={["#202020"]} />;
      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        minDistance={1}
        maxDistance={10}
      />
      <Scene />
    </Canvas>
  );
};

export default App;
