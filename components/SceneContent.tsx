"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Custom Shader Material for the Fabric Effect
const WaveMaterial = ({ texture }: { texture: THREE.Texture }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    // Shader definition
    const shaderArgs = useMemo(
        () => ({
            uniforms: {
                uTime: { value: 0 },
                uTexture: { value: texture },
            },
            vertexShader: `
        varying vec2 vUv;
        uniform float uTime;

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Fabric Wave Simulation
          // Sine waves on multiple axes to create "cloth" ripples
          float wave1 = sin(pos.x * 2.5 + uTime * 0.6) * 0.1;
          float wave2 = sin(pos.y * 1.5 + uTime * 0.8) * 0.1;
          float wave3 = sin((pos.x + pos.y) + uTime) * 0.05;
          
          pos.z = wave1 + wave2 + wave3;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
            fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec4 color = texture2D(uTexture, vUv);
          
          // Slight vignette/shadowing based on movement for realism
          // We can't easily calculate normals in a simple shader without more work, 
          // effectively we treat this as a flat image that moves.
          
          gl_FragColor = color;
        }
      `,
        }),
        [texture]
    );

    useFrame((state) => {
        if (meshRef.current) {
            // Update uniform time
            // @ts-ignore
            meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <planeGeometry args={[16, 9, 32, 32]} />
            <shaderMaterial args={[shaderArgs]} side={THREE.DoubleSide} transparent />
        </mesh>
    );
};

export default function SceneContent() {
    const texture = useLoader(TextureLoader, "/images/hero.png");
    // Fix tone mapping for consistency with CSS
    texture.colorSpace = THREE.SRGBColorSpace;

    return <WaveMaterial texture={texture} />;
}
