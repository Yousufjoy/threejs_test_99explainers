"use client";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function HeroSection() {
  const canvasRef = useRef();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Check if the window object is available
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (isClient && canvasRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        0.5,
        1000
      );
      camera.position.set(0, 0, 200);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const loader = new GLTFLoader();
      loader.load("/monster.glb", (gltf) => {
        const model = gltf.scene;
        model.scale.set(2, 1.5, 2);
        scene.add(model);

        const mixer = new THREE.AnimationMixer(model);
        if (gltf.animations.length > 0)
          mixer.clipAction(gltf.animations[0]).play();

        const clock = new THREE.Clock();
        function animate() {
          requestAnimationFrame(animate);
          const delta = clock.getDelta();
          mixer.update(delta);
          renderer.render(scene, camera);
        }
        animate();
      });

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.autoRotateSpeed = 3;

      return () => {
        renderer.dispose();
      };
    }
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden ">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/bg.mov" type="video/mp4" />
        </video>
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Navigation */}
      <header className="relative z-10">
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Left Side: Logo/Brand Name */}
            <span className="text-3xl font-bold text-white">
              <span className="text-red-500 font-fanwood">99</span>
              <span className="font-fanwood text-black">Explainers</span>
            </span>

            {/* Right Side: Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <a
                href="#home"
                className="text-white hover:text-blue-400 transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#about"
                className="text-white hover:text-blue-400 transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#portfolio"
                className="text-white hover:text-blue-400 transition-colors duration-200"
              >
                Portfolio
              </a>
              <a
                href="#request-quote"
                className="text-white hover:text-blue-400 transition-colors duration-200"
              >
                Request a Quote
              </a>
              <a
                href="#learn"
                className="text-white hover:text-blue-400 transition-colors duration-200"
              >
                Learn
              </a>
              <a
                href="#contact-us"
                className="text-white hover:text-blue-400 transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 ">
        <div className="grid md:grid-cols-2 gap-8 min-h-[calc(100vh-120px)] items-center  px-[120px]">
          {/* Left Content */}
          <div className="space-y-8 md:pb-[100px] mb-[70px]">
            <h1 className="text-2xl md:text-6xl font-bold leading-tight mb-6 font-fanwood">
              <span className="text-white">Discover </span>
              <span className="text-red-500">99</span>Explainers
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-200  font-fanwood">
              Bringing stories to life with animated visuals. Experience the art
              of storytelling with high-quality, customized animations.
            </p>
            <button
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold 
                             hover:bg-blue-100 transform hover:scale-105 transition-all duration-200
                             shadow-lg hover:shadow-xl font-fanwood"
            >
              Learn More
            </button>
          </div>

          {/* Right Content - Canvas */}
          <div className="flex justify-center items-center h-screen  ml-[150px] mt-[50px] cursor-pointer ">
            <canvas ref={canvasRef} className="w-full max-w-2xl h-auto" />
          </div>
        </div>
      </main>
    </div>
  );
}
