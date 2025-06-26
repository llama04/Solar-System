import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Environment } from '@react-three/drei';
import * as THREE from 'three';
import planetData from "./planets.json";
import spaceTexture from "./8k_stars_milky_way.jpg";import sunTexture from "./2k_sun.jpg";import moonTexture from "./2k_moon.jpg";import sRingTexture from "./2k_saturn_ring_alpha.png";import uRingTexture from "./uranusringcolour.jpg";
import mercuryTexture from "./2k_mercury.jpg";import venusTexture from "./2k_venus.jpg";import earthTexture from "./2k_earth.jpg";import marsTexture from "./2k_mars.jpg";import jupiterTexture from "./2k_jupiter.jpg";import saturnTexture from "./2k_saturn.jpg";import uranusTexture from "./2k_uranus.jpg";import neptuneTexture from "./2k_neptune.jpg";import plutoTexture from "./2k_pluto.jpg";

const planets = [];
const planetTextures = [mercuryTexture,venusTexture,earthTexture,marsTexture,jupiterTexture,saturnTexture,uranusTexture,neptuneTexture,plutoTexture];

console.log(window.location.pathname);

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
    <Canvas camera={{ position: [120,60,120], fov: 80 }}>
      <Environment files={spaceTexture} background backgroundBlurriness={0.02}/>
      <Sun />
      <AsteroidBelt />
      {planetData.planets.map((planet) => (
        <Planet planet={planet} key={planet.id} />
      ))}
      <SaturnRing />
      <UranusRing />
      <Moon />
      <Lights />
      <OrbitControls />
    </Canvas>
    </div> 
  );
}

function Sun() {
  const sun = React.useRef();
  useFrame(({clock}) => {
    const index = clock.elapsedTime;
    sun.current.rotation.y = index/20;
  })
  return (
    <mesh ref={sun}>
      <sphereGeometry args={[15, 32, 32]} />
      <meshStandardMaterial map={useTexture(sunTexture)} />
    </mesh>
  );
}

function Planet({ planet: { id,name,velocity,rotation, xOrbitalRadius, zOrbitalRadius, radius } }) {
  const planet = React.useRef();
  planets[id] = planet;
  useFrame(({ clock }) => {
      const index = clock.elapsedTime;
      planet.current.rotation.y = 15*index/rotation;
      const angle = (index / 360) * velocity * Math.PI;
      planet.current.position.set(xOrbitalRadius * Math.cos(angle),0,zOrbitalRadius * Math.sin(angle));
  })
  return (
    <>
      <mesh ref = {planet} name={name}  position={[xOrbitalRadius, 0, 0]}>
        <sphereGeometry args={[radius,32,32]}/>
        <meshStandardMaterial map={useTexture(planetTextures[id])} />
      </mesh>
      <Ecliptic xRadius={xOrbitalRadius} zRadius={zOrbitalRadius} />
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
  const belt = React.useRef();
  useFrame(({ clock }) => {
    belt.current.rotation.z = clock.elapsedTime*2;
  })
  return(
    <mesh ref = {belt} rotation = {[Math.PI/2,0,0]}>
      <torusGeometry args={[70,5,2]} />
      <meshStandardMaterial map={useTexture(sRingTexture)}/>
    </mesh>
  )
}

function SaturnRing(){
  const ring = React.useRef();
  useFrame(({ clock }) => {
    ring.current.position.set(planets[5].current.position.x,0,planets[5].current.position.z);
    ring.current.rotation.x = Math.PI/2+ Math.sin(clock.elapsedTime)/4;
    ring.current.rotation.y = Math.cos(clock.elapsedTime)/4;
    ring.current.rotation.z = clock.elapsedTime;

  })
  return (
    <mesh ref = {ring} position={[80,0,0]} rotation={[Math.PI/2,0,0]} >
      <torusGeometry args={[4, 0.75, 2.5]} />
      <meshStandardMaterial map={useTexture(sRingTexture)} />
    </mesh>
  );
}
function UranusRing(){
  const ring = React.useRef();
  useFrame(({ }) => {
    ring.current.position.set(planets[6].current.position.x,0,planets[6].current.position.z);
  })
  return (
    <mesh ref = {ring} position={[80,0,0]} rotation={[Math.PI/9,0,0]}>
      <torusGeometry args={[3, 0.3, 2.5]} />
      <meshStandardMaterial map={useTexture(uRingTexture)} />
    </mesh>
  );
}

function Moon(){
  const moon = React.useRef();
  useFrame(({ clock }) => {
    const index = clock.elapsedTime;
    moon.current.rotation.y = 15*index/655;
    const xEarthPos = planets[2].current.position.x;
    const zEarthPos = planets[2].current.position.z;
    const angle = (index / 360) * 398 * Math.PI;
    moon.current.position.set((3 * Math.cos(angle))+xEarthPos,0.5*Math.sin(angle),(3 * Math.sin(angle))+zEarthPos);
  })
  return (
    <mesh ref ={moon}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial map={useTexture(moonTexture)} />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity= {1.5}/>
      <pointLight position={[0, 0, 0]} />
    </>
  );
}