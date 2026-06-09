import * as THREE from "three";
import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/TechStack.css";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Refined elite domain details
const domainDetails: Record<string, {
  name: string;
  category: string;
  description: string;
  level: string;
  proficiency: number;
  glowColor: string;
  technologies: string[];
  projects: string[];
}> = {
  python: {
    name: "Python",
    category: "Programming Language",
    description: "The absolute backbone of our intelligent services. Utilized extensively for complex statistical algorithms, artificial intelligence pipelines, data extraction, and real-time computer vision scripting.",
    level: "Elite / Expert",
    proficiency: 95,
    glowColor: "#ffd43b", // Warm python gold
    technologies: ["NumPy", "Pandas", "OpenCV", "TensorFlow", "PyTorch", "SciPy"],
    projects: ["Leaf Disease Detector ML Model", "Cyberbullying NLP Classifier"]
  },
  react: {
    name: "React & Modern Web",
    category: "Frontend Development",
    description: "Building immersive, lightning-fast, and responsive modern user interfaces. Focused heavily on premium interactivity, 3D WebGL experiences, and smooth browser animations.",
    level: "Advanced Specialist",
    proficiency: 92,
    glowColor: "#00d8ff", // React cyan
    technologies: ["React 19", "TypeScript", "Tailwind CSS", "GSAP Animations", "Three.js / React Three Fiber"],
    projects: ["IntellMeet AI Platform", "Premium Interactive 3D Portfolio", "Borage Leaf Disease Flutter UI", "Interactive Data Visualizers"]
  },
  nodejs: {
    name: "Node.js & Systems",
    category: "Backend Architecture",
    description: "Architecting scalable backend ecosystems, highly performant RESTful APIs, and secure server-side applications with optimized transaction handling.",
    level: "Highly Proficient",
    proficiency: 88,
    glowColor: "#539e43", // Node green
    technologies: ["Express.js", "REST APIs", "JWT Security", "WebSockets", "MongoDB Mongoose"],
    projects: ["Student Exam Portal", "IntellMeet Backend Server", "Central Portfolio Analytics", "Secure User Auth Protocols"]
  },
  cv: {
    name: "Computer Vision",
    category: "Applied Perception",
    description: "Teaching computers to interpret and understand the visual world. Building real-time object classifiers, custom motion trackers, and sensory visual scanners.",
    level: "Core Specialization",
    proficiency: 90,
    glowColor: "#ff3e00", // Vision orange-red
    technologies: ["OpenCV (Python)", "YOLO v8 Object Detection", "MediaPipe Landmarks Tracking", "Image Processing"],
    projects: ["Borage Leaf Disease Visual Scanner", "Real-time WebRTC Video Stream"]
  },
  aiml: {
    name: "AI & Machine Learning",
    category: "Intelligent Systems",
    description: "Designing neural network pipelines, custom training routines, vector search embeddings, and predictive systems that adapt and scale with user data.",
    level: "Core Specialization",
    proficiency: 93,
    glowColor: "#8a2be2", // Purple glow
    technologies: ["TensorFlow", "PyTorch", "Scikit-Learn", "LangChain LLM Framework", "Google Gemini API"],
    projects: ["Student Exam Portal (Gemini API)", "IntellMeet AI Summarizer", "Autonomous Leaf Disease ML Predictor"]
  },
  java: {
    name: "Java & Core Software",
    category: "Software Engineering",
    description: "Building a bulletproof foundation in core computer science paradigms. Expert in object-oriented programming (OOP), memory-efficient algorithms, and algorithmic problem solving.",
    level: "Solid Foundation",
    proficiency: 85,
    glowColor: "#f89820", // Java warm orange
    technologies: ["OOP Design Patterns", "Data Structures (Trees, Graphs, Maps)", "Complex Algorithmic Optimization"],
    projects: ["Algorithmic Optimization Systems", "CS Problem Solving Repositories"]
  }
};

// Target rotations for each face of the cube to face the camera
const rotations: Record<string, { x: number; y: number; z: number }> = {
  python: { x: 0, y: 0, z: 0 },
  react: { x: 0, y: -Math.PI / 2, z: 0 },
  typescript: { x: 0, y: Math.PI, z: 0 }, // fallback (represents Back / AI & ML)
  aiml: { x: 0, y: Math.PI, z: 0 }, // Back Face
  nodejs: { x: 0, y: Math.PI / 2, z: 0 }, // Left Face
  cv: { x: Math.PI / 2, y: 0, z: 0 }, // Top Face (fixed: cv is top)
  java: { x: -Math.PI / 2, y: 0, z: 0 } // Bottom Face (fixed: java is bottom)
};

// Dynamically draws luxury glowing vector icons on canvas to generate ThreeJS textures
function createVectorIconTexture(iconName: string, glowColor: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Fully transparent background
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillRect(0, 0, 512, 512);

  // Set line styling for luxury vector icons
  ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Subtle brand-specific glow
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 24;

  if (iconName === "python") {
    // Elegant interlocking minimalist snakes representing Python S-loop
    ctx.lineWidth = 16;
    ctx.beginPath();
    // Top snake head & body
    ctx.moveTo(256, 170);
    ctx.lineTo(310, 170);
    ctx.arc(310, 220, 50, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(256, 270);
    ctx.lineTo(230, 270);
    ctx.arc(230, 220, 50, Math.PI / 2, -Math.PI / 2, false);
    ctx.stroke();

    // Bottom snake head & body (inverted)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.beginPath();
    ctx.moveTo(256, 342);
    ctx.lineTo(202, 342);
    ctx.arc(202, 292, 50, Math.PI / 2, -Math.PI / 2, false);
    ctx.lineTo(256, 242);
    ctx.lineTo(282, 242);
    ctx.arc(282, 292, 50, -Math.PI / 2, Math.PI / 2, false);
    ctx.stroke();

    // Eye dots
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(230, 195, 8, 0, Math.PI * 2); // top snake eye
    ctx.arc(282, 317, 8, 0, Math.PI * 2); // bottom snake eye
    ctx.fill();
  } 
  else if (iconName === "react") {
    // Three intersecting orbit ellipses and central nucleus
    const centerX = 256;
    const centerY = 256;
    ctx.lineWidth = 12;

    const drawOrbit = (angle: number) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 185, 65, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    drawOrbit(0);
    drawOrbit(Math.PI / 3);
    drawOrbit((2 * Math.PI) / 3);

    // Central Nucleus
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
    ctx.fill();
  } 
  else if (iconName === "nodejs") {
    // Futuristic Node hexagon and core leaf stem
    const drawHexagon = (x: number, y: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
      }
      ctx.closePath();
      ctx.stroke();
    };

    // Outer Hexagon
    ctx.lineWidth = 14;
    drawHexagon(256, 256, 170);

    // Inner leaf icon
    ctx.beginPath();
    ctx.moveTo(256, 350);
    ctx.lineTo(256, 160); // stem
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.moveTo(256, 180);
    ctx.quadraticCurveTo(320, 230, 256, 290);
    ctx.quadraticCurveTo(192, 230, 256, 180);
    ctx.fill();
  } 
  else if (iconName === "cv") {
    // Computer Vision: scanner target reticle and crop corners
    const centerX = 256;
    const centerY = 256;

    // Outer crop corners
    const d = 160;
    const len = 40;
    ctx.lineWidth = 14;

    // Top-Left corner
    ctx.beginPath(); ctx.moveTo(centerX - d, centerY - d + len); ctx.lineTo(centerX - d, centerY - d); ctx.lineTo(centerX - d + len, centerY - d); ctx.stroke();
    // Top-Right corner
    ctx.beginPath(); ctx.moveTo(centerX + d, centerY - d + len); ctx.lineTo(centerX + d, centerY - d); ctx.lineTo(centerX + d - len, centerY - d); ctx.stroke();
    // Bottom-Left corner
    ctx.beginPath(); ctx.moveTo(centerX - d, centerY + d - len); ctx.lineTo(centerX - d, centerY + d); ctx.lineTo(centerX - d + len, centerY + d); ctx.stroke();
    // Bottom-Right corner
    ctx.beginPath(); ctx.moveTo(centerX + d, centerY + d - len); ctx.lineTo(centerX + d, centerY + d); ctx.lineTo(centerX + d - len, centerY + d); ctx.stroke();

    // Central camera iris/lens
    ctx.beginPath();
    ctx.arc(centerX, centerY, 70, 0, Math.PI * 2);
    ctx.stroke();

    // Pupil
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Cybernetic scanner line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(centerX - 130, centerY);
    ctx.lineTo(centerX + 130, centerY);
    ctx.stroke();
  } 
  else if (iconName === "aiml") {
    // Artificial Intelligence: neural synapic network layers
    const centerX = 256;
    const centerY = 256;
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";

    // Nodes coordinates
    const nodes = [
      { x: centerX - 120, y: centerY }, // Input Node
      { x: centerX, y: centerY - 110 }, // Hidden Node 1
      { x: centerX, y: centerY + 110 }, // Hidden Node 2
      { x: centerX + 120, y: centerY }  // Output Node
    ];

    // Connection lines
    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y); ctx.lineTo(nodes[1].x, nodes[1].y);
    ctx.moveTo(nodes[0].x, nodes[0].y); ctx.lineTo(nodes[2].x, nodes[2].y);
    ctx.moveTo(nodes[1].x, nodes[1].y); ctx.lineTo(nodes[3].x, nodes[3].y);
    ctx.moveTo(nodes[2].x, nodes[2].y); ctx.lineTo(nodes[3].x, nodes[3].y);
    ctx.moveTo(nodes[1].x, nodes[1].y); ctx.lineTo(nodes[2].x, nodes[2].y);
    ctx.stroke();

    // Draw solid nodes circles with glowing bounds
    ctx.shadowBlur = 30;
    ctx.fillStyle = "#ffffff";
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
      ctx.fill();
    });

    // Sub-core accents
    ctx.fillStyle = glowColor;
    ctx.shadowBlur = 0;
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  } 
  else if (iconName === "java") {
    // Stylized, premium glowing coffee cup with rising steam waves
    const centerX = 256;
    const centerY = 280;
    ctx.lineWidth = 14;

    // Cup outline
    ctx.beginPath();
    ctx.moveTo(centerX - 90, centerY - 50);
    ctx.lineTo(centerX + 90, centerY - 50);
    ctx.quadraticCurveTo(centerX + 80, centerY + 60, centerX, centerY + 60);
    ctx.quadraticCurveTo(centerX - 80, centerY + 60, centerX - 90, centerY - 50);
    ctx.stroke();

    // Handle
    ctx.beginPath();
    ctx.arc(centerX + 110, centerY - 10, 35, -Math.PI / 2, Math.PI / 2, false);
    ctx.stroke();

    // Saucer plate
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 80, 110, 15, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Steaming waves
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    const drawSteam = (offset: number) => {
      ctx.beginPath();
      ctx.moveTo(centerX + offset, centerY - 70);
      ctx.bezierCurveTo(
        centerX + offset - 15, centerY - 100, 
        centerX + offset + 15, centerY - 120, 
        centerX + offset, centerY - 150
      );
      ctx.stroke();
    };

    drawSteam(-35);
    drawSteam(0);
    drawSteam(35);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 3D Orbital particle swarm and glowing wireframe connection lines
function SynapticParticlesAndWireframe() {
  const pointsRef = useRef<THREE.Points>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  // Generate 60 static particle positions orbiting the cube
  const particlePositions = useMemo(() => {
    const arr = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      const radius = 5.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    // Slowly orbit particles around the scene
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
    // Subtle breathing pulsing on wireframe connection box
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -state.clock.getElapsedTime() * 0.03;
      const pulse = 1.0 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.04;
      wireframeRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group>
      {/* 3D Orbiting particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#adacac"
          size={0.12}
          sizeAttenuation={true}
          transparent
          opacity={0.7}
        />
      </points>

      {/* Futuristic thin dodecahedron connection wireframe */}
      <mesh ref={wireframeRef}>
        <dodecahedronGeometry args={[4.8, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  );
}

type InteractiveCubeProps = {
  activeTech: string;
  setActiveTech: (tech: string) => void;
  hoveredTech: string | null;
  setHoveredTech: (tech: string | null) => void;
  isAutoplay: boolean;
  setIsAutoplay: (autoplay: boolean) => void;
};

function InteractiveCube({
  activeTech,
  setActiveTech,
  hoveredTech,
  setHoveredTech,
  isAutoplay,
  setIsAutoplay
}: InteractiveCubeProps) {
  const parallaxRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Group>(null);

  // Generate vector textures dynamically
  const textures = useMemo(() => {
    return {
      python: createVectorIconTexture("python", domainDetails.python.glowColor),
      react: createVectorIconTexture("react", domainDetails.react.glowColor),
      nodejs: createVectorIconTexture("nodejs", domainDetails.nodejs.glowColor),
      cv: createVectorIconTexture("cv", domainDetails.cv.glowColor),
      aiml: createVectorIconTexture("aiml", domainDetails.aiml.glowColor),
      java: createVectorIconTexture("java", domainDetails.java.glowColor)
    };
  }, []);

  useFrame((state) => {
    // 1. Mouse movement parallax
    if (parallaxRef.current) {
      const targetParallaxX = state.pointer.x * 0.25;
      const targetParallaxY = -state.pointer.y * 0.25;
      parallaxRef.current.rotation.y = THREE.MathUtils.lerp(parallaxRef.current.rotation.y, targetParallaxX, 0.05);
      parallaxRef.current.rotation.x = THREE.MathUtils.lerp(parallaxRef.current.rotation.x, targetParallaxY, 0.05);
    }

    // 2. Slow autoplay rotation or smooth lock-to-face rotation
    if (cubeRef.current) {
      if (isAutoplay) {
        cubeRef.current.rotation.y += 0.004;
        cubeRef.current.rotation.x += 0.002;
      } else {
        const target = rotations[activeTech];
        cubeRef.current.rotation.x = THREE.MathUtils.lerp(cubeRef.current.rotation.x, target.x, 0.08);
        cubeRef.current.rotation.y = THREE.MathUtils.lerp(cubeRef.current.rotation.y, target.y, 0.08);
        cubeRef.current.rotation.z = THREE.MathUtils.lerp(cubeRef.current.rotation.z, target.z, 0.08);
      }
    }
  });

  const handleFaceClick = (tech: string, e: any) => {
    e.stopPropagation();
    setIsAutoplay(false);
    setActiveTech(tech);
  };

  const metallicMaterial = new THREE.MeshPhysicalMaterial({
    color: "#0a0a0c",
    metalness: 0.96,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    reflectivity: 0.9
  });

  // Dynamically raises the face slightly proud on hover
  const getFaceZOffset = (tech: string) => {
    return hoveredTech === tech || activeTech === tech ? 1.63 : 1.61;
  };

  return (
    <group ref={parallaxRef}>
      <group ref={cubeRef} scale={[1.1, 1.1, 1.1]}>
        {/* Sleek metallic black core cube */}
        <RoundedBox args={[3.2, 3.2, 3.2]} radius={0.15} smoothness={5} castShadow receiveShadow>
          <primitive object={metallicMaterial} attach="material" />
        </RoundedBox>

        {/* 6 Technology face plates with custom textures */}
        
        {/* Front Face: Python */}
        <mesh 
          position={[0, 0, getFaceZOffset("python")]} 
          onClick={(e) => handleFaceClick("python", e)}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredTech("python"); }}
          onPointerOut={() => setHoveredTech(null)}
          scale={hoveredTech === "python" ? [1.05, 1.05, 1] : [1, 1, 1]}
        >
          <planeGeometry args={[2.3, 2.3]} />
          <meshStandardMaterial 
            map={textures.python} 
            transparent 
            roughness={0.2}
            metalness={0.8}
            emissive={domainDetails.python.glowColor}
            emissiveMap={textures.python}
            emissiveIntensity={hoveredTech === "python" || activeTech === "python" ? 1.8 : 0.25}
          />
        </mesh>

        {/* Back Face: AI & Machine Learning */}
        <mesh 
          position={[0, 0, -getFaceZOffset("aiml")]} 
          rotation={[0, Math.PI, 0]}
          onClick={(e) => handleFaceClick("aiml", e)}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredTech("aiml"); }}
          onPointerOut={() => setHoveredTech(null)}
          scale={hoveredTech === "aiml" ? [1.05, 1.05, 1] : [1, 1, 1]}
        >
          <planeGeometry args={[2.3, 2.3]} />
          <meshStandardMaterial 
            map={textures.aiml} 
            transparent 
            roughness={0.2}
            metalness={0.8}
            emissive={domainDetails.aiml.glowColor}
            emissiveMap={textures.aiml}
            emissiveIntensity={hoveredTech === "aiml" || activeTech === "aiml" ? 1.8 : 0.25}
          />
        </mesh>

        {/* Right Face: React */}
        <mesh 
          position={[getFaceZOffset("react"), 0, 0]} 
          rotation={[0, Math.PI / 2, 0]}
          onClick={(e) => handleFaceClick("react", e)}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredTech("react"); }}
          onPointerOut={() => setHoveredTech(null)}
          scale={hoveredTech === "react" ? [1.05, 1.05, 1] : [1, 1, 1]}
        >
          <planeGeometry args={[2.3, 2.3]} />
          <meshStandardMaterial 
            map={textures.react} 
            transparent 
            roughness={0.2}
            metalness={0.8}
            emissive={domainDetails.react.glowColor}
            emissiveMap={textures.react}
            emissiveIntensity={hoveredTech === "react" || activeTech === "react" ? 1.8 : 0.25}
          />
        </mesh>

        {/* Left Face: Node.js */}
        <mesh 
          position={[-getFaceZOffset("nodejs"), 0, 0]} 
          rotation={[0, -Math.PI / 2, 0]}
          onClick={(e) => handleFaceClick("nodejs", e)}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredTech("nodejs"); }}
          onPointerOut={() => setHoveredTech(null)}
          scale={hoveredTech === "nodejs" ? [1.05, 1.05, 1] : [1, 1, 1]}
        >
          <planeGeometry args={[2.3, 2.3]} />
          <meshStandardMaterial 
            map={textures.nodejs} 
            transparent 
            roughness={0.2}
            metalness={0.8}
            emissive={domainDetails.nodejs.glowColor}
            emissiveMap={textures.nodejs}
            emissiveIntensity={hoveredTech === "nodejs" || activeTech === "nodejs" ? 1.8 : 0.25}
          />
        </mesh>

        {/* Top Face: Computer Vision */}
        <mesh 
          position={[0, getFaceZOffset("cv"), 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={(e) => handleFaceClick("cv", e)}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredTech("cv"); }}
          onPointerOut={() => setHoveredTech(null)}
          scale={hoveredTech === "cv" ? [1.05, 1.05, 1] : [1, 1, 1]}
        >
          <planeGeometry args={[2.3, 2.3]} />
          <meshStandardMaterial 
            map={textures.cv} 
            transparent 
            roughness={0.2}
            metalness={0.8}
            emissive={domainDetails.cv.glowColor}
            emissiveMap={textures.cv}
            emissiveIntensity={hoveredTech === "cv" || activeTech === "cv" ? 1.8 : 0.25}
          />
        </mesh>

        {/* Bottom Face: Java */}
        <mesh 
          position={[0, -getFaceZOffset("java"), 0]} 
          rotation={[Math.PI / 2, 0, 0]}
          onClick={(e) => handleFaceClick("java", e)}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredTech("java"); }}
          onPointerOut={() => setHoveredTech(null)}
          scale={hoveredTech === "java" ? [1.05, 1.05, 1] : [1, 1, 1]}
        >
          <planeGeometry args={[2.3, 2.3]} />
          <meshStandardMaterial 
            map={textures.java} 
            transparent 
            roughness={0.2}
            metalness={0.8}
            emissive={domainDetails.java.glowColor}
            emissiveMap={textures.java}
            emissiveIntensity={hoveredTech === "java" || activeTech === "java" ? 1.8 : 0.25}
          />
        </mesh>
      </group>
    </group>
  );
}

// Terminal subtitle typewriter text
function TerminalSubtitle() {
  const fullText = "Technologies powering my ideas and innovations.";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="tech-terminal-subtitle">
      <span>{displayText}</span>
      <span className="tech-terminal-cursor" />
    </p>
  );
}

const TechStack = () => {
  const [activeTech, setActiveTech] = useState<string>("python");
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);

  // Resume idle autoplay rotation after 8 seconds of user inactivity
  useEffect(() => {
    if (isAutoplay) return;
    const timer = setTimeout(() => {
      setIsAutoplay(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [isAutoplay, activeTech]);

  // Elegant fade-in slide-up ScrollTrigger animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      console.log("DEBUG TechStack: Registering ScrollTrigger for techstack-section");
      gsap.fromTo(
        ".techstack-section",
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".techstack-section",
            start: "top 92%", // triggers precisely after Work finishes sliding
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    console.log("DEBUG TechStack: mounted, calling ScrollSmoother.get()?.refresh()");
    ScrollSmoother.get()?.refresh();

    const tempTrigger = ScrollTrigger.create({
      trigger: ".techstack-section",
      start: "top 92%",
    });
    console.log("DEBUG TechStack: computed start scroll position =", tempTrigger.start);
    tempTrigger.kill();

    return () => ctx.revert();
  }, []);

  const activeDetails = domainDetails[activeTech];

  return (
    <div className="techstack-section">
      <div className="techstack-container section-container">
        <div className="techstack-header-area">
          <h2>Core <span>Expertise</span></h2>
          <TerminalSubtitle />
        </div>
        
        <div className="techstack-flex">
          {/* Left/Center Block: 3D Interactive Canvas & Live Stats */}
          <div className="tech-left-column">
            <div className="cube-wrapper">
              <Canvas
                shadows
                gl={{ alpha: true, antialias: true }}
                camera={{ position: [0, 0, 10], fov: 45 }}
                className="tech-cube-canvas"
              >
                <ambientLight intensity={0.6} />
                <spotLight
                  position={[10, 15, 10]}
                  penumbra={1}
                  angle={0.35}
                  color="#ffffff"
                  castShadow
                  intensity={1.8}
                  shadow-mapSize={[1024, 1024]}
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <Suspense fallback={null}>
                  <InteractiveCube
                    activeTech={activeTech}
                    setActiveTech={setActiveTech}
                    hoveredTech={hoveredTech}
                    setHoveredTech={setHoveredTech}
                    isAutoplay={isAutoplay}
                    setIsAutoplay={setIsAutoplay}
                  />
                  <SynapticParticlesAndWireframe />
                  <Environment
                    files="/models/char_enviorment.hdr"
                    environmentIntensity={0.8}
                    environmentRotation={[0, 4, 2]}
                  />
                  <EffectComposer enableNormalPass={false}>
                    <N8AO color="#000000" aoRadius={1.5} intensity={1.2} />
                  </EffectComposer>
                </Suspense>
              </Canvas>
            </div>

            {/* Premium Live Statistics Card Grid */}
            <div className="tech-stats-grid">
              <div className="stat-box">
                <span className="stat-val">6</span>
                <span className="stat-label">Core Domains</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">20+</span>
                <span className="stat-label">Technologies</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">15+</span>
                <span className="stat-label">Projects Built</span>
              </div>
              <div className="stat-box specialized">
                <span className="stat-val" style={{ fontSize: "18px", color: "var(--accentColor)" }}>AI + CV + Full Stack</span>
                <span className="stat-label">Primary Specialization</span>
              </div>
            </div>
          </div>

          {/* Right Block: Minimal Luxury Info Card */}
          <div className="tech-info-card">
            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTech}
                  initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -20, filter: "blur(5px)" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="tech-info-header"
                >
                  <div className="tech-info-title-area">
                    <span>{activeDetails.category}</span>
                    <h3>{activeDetails.name}</h3>
                  </div>

                  {/* Circular progress bar */}
                  <div className="proficiency-circle">
                    <svg>
                      <circle className="bg-ring" cx="32.5" cy="32.5" r="28" />
                      <circle
                        className="progress-ring"
                        cx="32.5"
                        cy="32.5"
                        r="28"
                        stroke={activeDetails.glowColor}
                        strokeDasharray="175.9"
                        strokeDashoffset={175.9 - (175.9 * activeDetails.proficiency) / 100}
                      />
                    </svg>
                    <div className="proficiency-value">{activeDetails.proficiency}%</div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${activeTech}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                  <p className="tech-info-desc">{activeDetails.description}</p>
                  
                  <div className="tech-sub-lists-wrapper">
                    {/* Level display */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)" }}>Expertise:</span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: activeDetails.glowColor }}>{activeDetails.level}</span>
                    </div>

                    {/* Technologies list */}
                    <div className="tech-list-container">
                      <h4>Related Technologies</h4>
                      <div className="tech-badges-grid">
                        {activeDetails.technologies.map((t, idx) => (
                          <div key={idx} className="tech-tag">{t}</div>
                        ))}
                      </div>
                    </div>

                    {/* Associated Projects list */}
                    <div className="tech-list-container">
                      <h4>Projects Using This Stack</h4>
                      <div className="projects-list-container">
                        {activeDetails.projects.map((p, idx) => (
                          <div key={idx} className="tech-project-item">
                            <div className="project-bullet" style={{ backgroundColor: activeDetails.glowColor }} />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "10px 0" }} />

            {/* Interactive Domain Navigation Pills */}
            <div className="tech-nav-pills">
              {Object.keys(domainDetails).map((key) => (
                <button
                  key={key}
                  className={`tech-pill ${activeTech === key ? "active" : ""}`}
                  style={{
                    boxShadow: activeTech === key ? `0 0 15px ${domainDetails[key].glowColor}25` : "none",
                    borderColor: activeTech === key ? `${domainDetails[key].glowColor}50` : "rgba(255, 255, 255, 0.05)"
                  }}
                  onClick={() => {
                    setIsAutoplay(false);
                    setActiveTech(key);
                  }}
                >
                  {domainDetails[key].name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;
