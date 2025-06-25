import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from "@react-three/fiber";
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import planetData from "./planets.json";

//const response = await fetch('Solar-System/src/planets.json');
//const planetData = await response.json();
const planets = [];

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
    <Canvas camera={{ position: [120,60,120], fov: 80 }}>
      <color attach="background" args={["grey"]} />
      <Sun />
      <AsteroidBelt />
      {planetData.planets.map((planet) => (
        <Planet planet={planet} key={planet.id} />
      ))}
      <SaturnRing />
      <Lights />
      <OrbitControls />
    </Canvas>
    </div> 
  );
}

function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[15, 32, 32]} />
      <meshStandardMaterial color="#E1DC59" />
    </mesh>
  );
}

function Planet({ planet: { id,name,color,velocity, xOrbitalRadius, zOrbitalRadius, radius } }) {
  const planet = React.useRef();
  planets[id] = planet;
  useFrame(({ clock }) => {
      const index = clock.elapsedTime % 360;
      const angle = (index / 360) * velocity * Math.PI;
      planet.current.position.set(xOrbitalRadius * Math.cos(angle),0,zOrbitalRadius * Math.sin(angle));
  })
  return (
    <>
      <mesh ref = {planet} name={name} position={[xOrbitalRadius, 0, 0]}>
        <sphereGeometry args={[radius,32,32]}/>
        <meshStandardMaterial color={color} />
      </mesh>
      <Ecliptic xRadius={xOrbitalRadius} zRadius={zOrbitalRadius} />
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity= {5}/>
      <pointLight position={[0, 0, 0]} />
    </>
  );
}

function Ecliptic({ xRadius, zRadius }) {
  const points = [];
  for (let index = 0; index < 64; index++) {
    const angle = (index / 64) * 2 * Math.PI;
    const x = xRadius * Math.cos(angle);
    const z = zRadius * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }
  points.push(points[0]);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#BFBBDA" linewidth={5} />
    </line>
  );
}

function AsteroidBelt(){
  return(
    <mesh rotation = {[Math.PI/2,0,0]}>
      <torusGeometry args={[70,5,2]} />
      <meshStandardMaterial color="#FFF" />
    </mesh>
  )
}

function SaturnRing(){
  const ring = React.useRef();
  useFrame(({ clock }) => {
    ring.current.position.set(planets[5].current.position.x,0,planets[5].current.position.z);
    console.log(planets[5].current.position);
  })
  return (
    <mesh ref = {ring} position={[80,0,0]} rotation={[Math.PI/2,0,0]}>
      <torusGeometry args={[4, 0.75, 2.5]} />
      <meshStandardMaterial color="#eddbad" />
    </mesh>
  );
}

function Moon(){
  return (
    <mesh>
      <sphereGeometry args={[15, 32, 32]} />
      <meshStandardMaterial color="#E1DC59" />
    </mesh>
  );
}