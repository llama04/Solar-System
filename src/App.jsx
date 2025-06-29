import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Environment } from '@react-three/drei';
import * as THREE from 'three';
import planetData from "./planets.json";
import spaceTexture from "./8k_stars_milky_way.jpg";import sunTexture from "./2k_sun.jpg";import moonTexture from "./2k_moon.jpg";import sRingTexture from "./2k_saturn_ring_alpha.png";import uRingTexture from "./uranusringcolour.jpg";
import mercuryTexture from "./2k_mercury.jpg";import venusTexture from "./2k_venus.jpg";import earthTexture from "./2k_earth.jpg";import marsTexture from "./2k_mars.jpg";import jupiterTexture from "./2k_jupiter.jpg";import saturnTexture from "./2k_saturn.jpg";import uranusTexture from "./2k_uranus.jpg";import neptuneTexture from "./2k_neptune.jpg";import plutoTexture from "./2k_pluto.jpg";

const planets = [];
const planetTextures = [mercuryTexture,venusTexture,earthTexture,marsTexture,jupiterTexture,saturnTexture,uranusTexture,neptuneTexture,plutoTexture];
var trackingPlanet;
var timeSpeed = 1;

export default function App() {
  return (
    <div >
      <div className="overlay1">
        <button type="button" onMouseDown={function(){trackingPlanet = planets[9]}}>Sun</button>
        <div className="divider"></div>
        <button type="button" onMouseDown={function(){trackingPlanet = planets[0]}}>Mercury</button>
        <div className="divider"></div>
        <button type="button" onMouseDown={function(){trackingPlanet = planets[1]}}>Venus</button>
        <div className="divider"></div>
        <button type="button" onMouseDown={function(){trackingPlanet = planets[2]}}>Earth</button>
        <div className="divider"></div>
        <button type="button" onMouseDown={function(){trackingPlanet = planets[10]}}>Moon</button>
        <div className="divider"></div>
        <button type="button" onMouseDown={function(){trackingPlanet = planets[3]}}>Mars</button>
        <div className="divider"></div>
        <button type="button" onMouseDown={function(){trackingPlanet = planets[4]}}>Jupiter</button>
        <div className="divider"></div>
        <button type="button" onMouseDown={function(){trackingPlanet = planets[5]}}>Saturn</button>
        <div className="divider"></div>
        <button type="button" onMouseDown={function(){trackingPlanet = planets[6]}}>Uranus</button>
        <div className="divider"></div>
        <button type="button" onMouseDown={function(){trackingPlanet = planets[7]}}>Neptune</button>
        <div className="divider"></div>
        <button type="button" onMouseDown={function(){trackingPlanet = planets[8]}}>Pluto</button>        
      </div>
      <div className="overlay2">
        <button type="button" onMouseDown={function(){SpeedDown()}}>&lt;&lt;</button>
        <div className="divider"></div>
        <input type="text" id="speedDisplay" placeholder = "1x"></input>
        <div className="divider"></div>
        <button type="button" onMouseDown={function(){SpeedUp()}}>&gt;&gt;</button>
      </div>
      <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [120,60,120], fov: 80}}>
        <SetButton/>
        <Environment files={spaceTexture} background backgroundBlurriness={0.02}/>
        <PlanetTracking />
        <Sun />
        <AsteroidBelt />
        {planetData.planets.map((planet) => (
          <Planet planet={planet} key={planet.id} />
        ))}
        <SaturnRing />
        <UranusRing />
        <Moon />
        <Lights />
      </Canvas>
      </div>
    </div> 
  );
}
function SetButton(){
  const input = document.getElementById("speedDisplay");
  input.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
      event.preventDefault();
      if(input.value[input.value.length-1] == "x"){
        timeSpeed = parseInt(input.value.substr(0,input.value.length-1));
      }else{
        timeSpeed = parseInt(input.value);
      }
      input.value = timeSpeed+"x";
    }
  })
}
function SpeedDown(){
  if((timeSpeed /2) < 0.25){
    timeSpeed = 0.25;
  } else{
    timeSpeed /= 2;
  }
  document.getElementById("speedDisplay").placeholder = timeSpeed+"x";
}
function SpeedUp(){
  timeSpeed *=2;
  document.getElementById("speedDisplay").placeholder = timeSpeed+"x";
}

function PlanetTracking(){
  const tracking = React.useRef();
  useFrame(({}) =>{
    tracking.current.target = trackingPlanet.current.position;    
  })
  return(
    <OrbitControls ref={tracking} />
  )
}

function Sun() {
  const sun = React.useRef();
  planets[9] = sun;
  trackingPlanet = sun;
  useFrame(({clock}) => {
    const index = clock.elapsedTime * timeSpeed;
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
      const index = clock.elapsedTime * timeSpeed;
      planet.current.rotation.y = 15*index/rotation ;
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
  for (let index = 0; index < 360; index++) {
    const angle = (index / 360) * 2 * Math.PI;
    const x = xRadius * Math.cos(angle);
    const z = zRadius * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }
  points.push(points[0]);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#BFBBDA" linewidth={0.5} />
    </line>
  );
}

function AsteroidBelt(){
  const belt = React.useRef();
  useFrame(({ clock }) => {
    belt.current.rotation.z = clock.elapsedTime/2 * timeSpeed;
  })
  return(
    <mesh ref = {belt} rotation = {[Math.PI/2,0,0]}>
      <torusGeometry args={[70,5,2,90]} />
      <meshStandardMaterial map={useTexture(sRingTexture)}/>
    </mesh>
  )
}

function SaturnRing(){
  const ring = React.useRef();
  useFrame(({ clock }) => {
    ring.current.position.set(planets[5].current.position.x,0,planets[5].current.position.z);
    ring.current.rotation.x = Math.PI/2+ Math.sin(clock.elapsedTime)/4 * timeSpeed;
    ring.current.rotation.y = Math.cos(clock.elapsedTime)/4 * timeSpeed;
    ring.current.rotation.z = clock.elapsedTime * timeSpeed;

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
  planets[10] = moon;
  useFrame(({ clock }) => {
    const index = clock.elapsedTime;
    moon.current.rotation.y = 15*index/655;
    const xEarthPos = planets[2].current.position.x;
    const zEarthPos = planets[2].current.position.z;
    const angle = (index / 360) * 398 * Math.PI * timeSpeed;
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