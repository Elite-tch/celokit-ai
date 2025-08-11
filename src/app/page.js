'use client'

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Code,  StepForward } from 'lucide-react';

// Mock FloatingChatButton component


const ThreeJSBackground = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create particles representing blockchain nodes
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    // Celo colors
    const celoGreen = new THREE.Color(0x35d07f);
    const celoGold = new THREE.Color(0xfbcc5c);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Position particles in a sphere
      const radius = Math.random() * 50 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);

      // Alternate between Celo colors
      const color = Math.random() > 0.5 ? celoGreen : celoGold;
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create connecting lines between nearby particles
    const linesGeometry = new THREE.BufferGeometry();
    const linesPositions = [];
    const linesColors = [];
    const positions = particlesGeometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 9) {
      const x1 = positions[i];
      const y1 = positions[i + 1];
      const z1 = positions[i + 2];

      for (let j = i + 9; j < positions.length; j += 9) {
        const x2 = positions[j];
        const y2 = positions[j + 1];
        const z2 = positions[j + 2];

        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);

        if (distance < 15) {
          linesPositions.push(x1, y1, z1, x2, y2, z2);

          const intensity = 1 - distance / 15;
          linesColors.push(
            celoGreen.r * intensity, celoGreen.g * intensity, celoGreen.b * intensity,
            celoGreen.r * intensity, celoGreen.g * intensity, celoGreen.b * intensity
          );
        }
      }
    }

    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linesPositions, 3));
    linesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(linesColors, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // Create floating geometric shapes
    const shapes = [];
    const shapeGeometries = [
      new THREE.OctahedronGeometry(2),
      new THREE.TetrahedronGeometry(2),
      new THREE.IcosahedronGeometry(1.5),
    ];

    for (let i = 0; i < 20; i++) {
      const geometry = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x35d07f : 0xfbcc5c,
        transparent: true,
        opacity: 0.6,
        wireframe: true,
      });

      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      shapes.push({
        mesh: shape,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.02,
        },
      });

      scene.add(shape);
    }

    camera.position.z = 30;

    // Mouse interaction
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate particle system
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.002;

      // Rotate lines
      linesMesh.rotation.x += 0.001;
      linesMesh.rotation.y += 0.002;

      // Animate floating shapes
      shapes.forEach((shape) => {
        shape.mesh.rotation.x += shape.rotationSpeed.x;
        shape.mesh.rotation.y += shape.rotationSpeed.y;
        shape.mesh.rotation.z += shape.rotationSpeed.z;
      });

      // Camera movement based on mouse
      camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();
    sceneRef.current = { scene, camera, renderer, shapes, particlesMesh, linesMesh };

    // Handle window resize
    const handleResize = () => {
      if (sceneRef.current) {
        const { camera, renderer } = sceneRef.current;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className='bg-[#1e002b]'>
      {/* 3D Background */}
      <div className="fixed inset-0 overflow-hidden">
        <ThreeJSBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen pt-24 md:pt-0 max-w- mx-auto flex flex-col items-center justify-center px-4 text-center z-10">

        {/* Main Heading */}
        <h1 className={`text-4xl md:text-6xl  lg:text-7xl font-black text-white mb-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Build Smarter  with  <span className="bg-gradient-to-r from-green-600 to-[#ffff57] bg-clip-text text-transparent"> 
             CeloKit-AI
          </span>
            
         
        </h1>

        {/* Subheading */}
        <p className={` md:text-md text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          The intelligent toolkit for Celo developers  AI-generated code, instant answers, and seamless wallet integration
          to accelerate your dApp development.
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button className="group relative w-60 md:w-fit flex justify-center px-5 py-4 bg-gradient-to-r from-green-600 to-[#ffff57] text-black font-bold rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden">
            <span className="relative flex items-center  space-x-3">
              <StepForward className="w-5 h-5" />
              <span>Try Demo</span>
            </span>
          </button>

          <button className="px-5 py-4  w-60 md:w-fit flex justify-center backdrop-blur-sm text-white font-bold rounded-full border border-white/20  hover:border-white/40 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl">
            <span className="flex items-center space-x-3">
              <Code className="w-5 h-5" />
              <span>View Docs</span>
            </span>
          </button>
        </div>


      </div>

      

      <style jsx global>{`
        body {
          margin: 0;
          overflow-x: hidden;
        }
        
        canvas {
          display: block;
        }
      `}</style>
    </div>
  );
}