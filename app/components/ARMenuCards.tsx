"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// @ts-ignore
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import lodash from "lodash";
import { Menu, X } from "lucide-react";

// ------------------ TYPES ------------------
interface FoodItem {
  id: number;
  name: string;
  value: string;
  description: string;
  price: number;
  image: string;
  merchant: number;
  quantity: number;
  model: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

// ------------------ CATEGORIES ------------------
const categories: Category[] = [
  { id: "appetizers", name: "Appetizers", icon: "🥗" },
  { id: "main", name: "Main Course", icon: "🍽️" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "beverages", name: "Beverages", icon: "🍺" },
];

// ------------------ MENU CARD COMPONENT ------------------
const MenuCard: React.FC<{ item: FoodItem }> = ({ item }) => (
  // <div
  //   className="inline-block w-screen px-4"
  //   style={{ scrollSnapAlign: "center" }}
  // >
  <div
    data-menu-card
    className="shrink-0 grow-0 basis-full px-4"
    style={{ scrollSnapAlign: "center" }}
  >
    <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl max-w-sm mx-auto border-2 border-red-500/50 hover:border-red-400 transition-all">
      <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
        {item.name}
      </h3>
      <p className="text-gray-200 mb-4 text-sm drop-shadow-md">{item.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-red-400 drop-shadow-lg">
          ₹{item.price}
        </span>
        <button className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/70 transition-all transform hover:scale-105 hover:-translate-y-0.5">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

// ------------------ CATEGORY SIDEBAR ------------------
const CategorySidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}> = ({ isOpen, onClose, selectedCategory, onSelectCategory }) => (
  <>
    {/* Backdrop */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-20"
        onClick={onClose}
        style={{ pointerEvents: "auto" }}
      />
    )}

    {/* Sidebar */}
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-white/98 via-red-50/98 to-red-100/98 backdrop-blur-xl shadow-2xl z-30 transform transition-transform duration-300 border-r-2 border-red-200 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ pointerEvents: "auto" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b-2 border-red-200">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          Categories
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-red-100 rounded-xl transition-colors"
        >
          <X className="w-6 h-6 text-red-700" />
        </button>
      </div>

      {/* Category List */}
      <div className="p-4 space-y-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              onSelectCategory(category.id);
              onClose();
            }}
            className={`w-full flex items-center gap-4 p-5 rounded-2xl transition-all transform ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white shadow-xl shadow-red-500/50 scale-105"
                : "bg-white/80 text-red-800 hover:bg-red-50 border-2 border-red-100 hover:border-red-300 hover:scale-102"
            }`}
          >
            <span className="text-3xl">{category.icon}</span>
            <span className="text-lg font-bold">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  </>
);

// ------------------ MENU LIST ------------------
export const menus: FoodItem[] = [
  {
    id: 1,
    name: "Pizza",
    value: "pizza",
    description: "Tasty pizza",
    price: 500,
    image: "",
    merchant: 1,
    quantity: 10,
    model: "/models/pzza/scene.gltf",
  },
  {
    id: 2,
    name: "Platter",
    value: "platter",
    description: "Delicious platter",
    price: 350,
    image: "",
    merchant: 1,
    quantity: 10,
    model: "/models/platter-1.glb",
  },
  {
    id: 3,
    name: "Murgmussallam",
    value: "murg",
    description: "Traditional murg",
    price: 250,
    image: "",
    merchant: 1,
    quantity: 10,
    model: "/models/murgmusallam-1.glb",
  },
  {
    id: 4,
    name: "Fish Fingers",
    value: "fishfingers",
    description: "Crispy fish fingers",
    price: 250,
    image: "",
    merchant: 1,
    quantity: 10,
    model: "/models/fishfingers-1.glb",
  },
  {
    id: 5,
    name: "Pasta",
    value: "pasta",
    description: "Fresh pasta",
    price: 250,
    image: "",
    merchant: 1,
    quantity: 10,
    model: "/models/pasta-1.glb",
  },
  {
    id: 6,
    name: "Beer Crate",
    value: "beer",
    description: "Chilled beer",
    price: 250,
    image: "",
    merchant: 1,
    quantity: 10,
    model: "/models/beer-1.glb",
  },
  {
    id: 7,
    name: "Chicken Bites",
    value: "chicken_bites",
    description: "Juicy chicken bites",
    price: 250,
    image: "",
    merchant: 1,
    quantity: 10,
    model: "/models/chicken_bites.glb",
  },
];

const ARMenuCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef(new THREE.Scene());
  // const cameraRef = useRef(
  //   new THREE.PerspectiveCamera(
  //     70,
  //     window.innerWidth / window.innerHeight,
  //     0.01,
  //     100
  //   )
  // );

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    cameraRef.current = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
  }, []);

  // const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
  }, []);


  const loadedModels = useRef<{ [key: string]: THREE.Object3D }>({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("main");
  const currentModelRef = useRef<THREE.Object3D | null>(null);
  const hoverOffsetRef = useRef(0);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const pinchDistanceRef = useRef(0);
  const modelScaleRef = useRef(1.2);
  const modelRotationRef = useRef({ x: 0, y: 0 });

  // ------------------ LOAD MODELS ------------------
  useEffect(() => {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    gltfLoader.setDRACOLoader(dracoLoader);

    menus.forEach((menuItem) => {
      gltfLoader.load(
        menuItem.model,
        (gltf: any) => {
          loadedModels.current[menuItem.value] = gltf.scene;
          console.log("Loaded:", menuItem.model);
        },
        undefined,
        (err: any) => console.error("Error loading", menuItem.model, err)
      );
    });
  }, []);

  // ------------------ CAMERA FEED ------------------
  const setupCameraFeed = async () => {
    const video = document.createElement("video") as unknown as HTMLVideoElement;
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.style.position = "fixed";
    video.style.top = "0";
    video.style.left = "0";
    video.style.width = "100vw";
    video.style.height = "100vh";
    video.style.objectFit = "cover";
    video.style.zIndex = "0";
    document.body.appendChild(video);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      video.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // ------------------ THREE.JS SETUP ------------------
  useEffect(() => {
    setupCameraFeed();

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    const container = containerRef.current;
    if (!container) return;

    const scene = sceneRef.current;
    const camera = cameraRef.current;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.zIndex = "1";
    renderer.domElement.style.pointerEvents = "auto";
    renderer.domElement.style.touchAction = "none";

    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-2, 0, -2);
    scene.add(fillLight);

    if (!camera) return;
    camera.position.set(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);

      if (currentModelRef.current) {
        currentModelRef.current.rotation.y = modelRotationRef.current.y;
        currentModelRef.current.rotation.x = modelRotationRef.current.x;

        if (!isDraggingRef.current) {
          modelRotationRef.current.y += 0.01;
        }

        hoverOffsetRef.current += 0.02;
        const hoverY = Math.sin(hoverOffsetRef.current) * 0.05;
        currentModelRef.current.position.y = -0.1 + hoverY;
        
        const scale = modelScaleRef.current;
        currentModelRef.current.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  const disposeObject = (obj: THREE.Object3D) => {
    obj.traverse((child: any) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m: any) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  };


  // ------------------ UPDATE MODEL ------------------
  const updateModel = () => {
    const scene = sceneRef.current;

    const old = scene.getObjectByName("menu-model");
    if (old) {
      const fadeOut = () => {
        if (old.scale.x > 0.1) {
          old.scale.multiplyScalar(0.9);
          requestAnimationFrame(fadeOut);
        } else {
          scene.remove(old);
          disposeObject(old); 
        }
      };
      fadeOut();
    }

    const model = loadedModels.current[menus[currentCardIndex].value];
    if (!model) return;

    const clone = model.clone();
    clone.name = "menu-model";

    const startScale = 0.2;
    clone.scale.set(startScale, startScale, startScale);
    clone.position.set(0, -0.1, -1.2);

    const targetScale = modelScaleRef.current;
    const fadeIn = () => {
      if (clone.scale.x < targetScale) {
        clone.scale.x += 0.08;
        clone.scale.y += 0.08;
        clone.scale.z += 0.08;
        requestAnimationFrame(fadeIn);
      } else {
        clone.scale.set(targetScale, targetScale, targetScale);
      }
    };
    fadeIn();

    scene.add(clone);
    currentModelRef.current = clone;
    hoverOffsetRef.current = 0;
  };

  // ------------------ TOUCH CONTROLS ------------------
  useEffect(() => {
    const canvas = rendererRef.current?.domElement;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      if (e.touches.length === 1 && isDraggingRef.current) {
        const deltaX = e.touches[0].clientX - touchStartRef.current.x;
        const deltaY = e.touches[0].clientY - touchStartRef.current.y;

        modelRotationRef.current.y += deltaX * 0.01;
        modelRotationRef.current.x += deltaY * 0.01;

        modelRotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, modelRotationRef.current.x));

        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (pinchDistanceRef.current > 0) {
          const delta = distance - pinchDistanceRef.current;
          modelScaleRef.current += delta * 0.005;
          modelScaleRef.current = Math.max(0.5, Math.min(3.0, modelScaleRef.current));
        }

        pinchDistanceRef.current = distance;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      isDraggingRef.current = false;
      pinchDistanceRef.current = 0;
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // ------------------ SCROLL HANDLER ------------------
  useEffect(() => {
    const handler = lodash.debounce(() => {
      if (!menuRef.current) return;

      const scrollLeft = menuRef.current.scrollLeft;
      const firstCard = menuRef.current.querySelector("[data-menu-card]") as HTMLDivElement | null;
      const cardWidth = firstCard?.offsetWidth ?? menuRef.current.offsetWidth;
      const idx = Math.round(scrollLeft / cardWidth);


      if (idx !== currentCardIndex) {
        setCurrentCardIndex(idx);
      }
    }, 200);

    menuRef.current?.addEventListener("scroll", handler);
    return () => menuRef.current?.removeEventListener("scroll", handler);
  }, [currentCardIndex]);

  useEffect(() => {
    updateModel();
  }, [currentCardIndex]);

  // ------------------ UI ------------------
  return (
    <div ref={containerRef} className="w-full h-full">
      {/* Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-6 left-6 z-50 bg-gradient-to-br from-white/95 to-red-50/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border-2 border-red-200 hover:border-red-300 hover:shadow-2xl hover:shadow-red-500/30 transition-all transform hover:scale-110"
        style={{ pointerEvents: "auto" }}
      >
        <Menu className="w-6 h-6 text-red-700" />
      </button>

      {/* Category Badge */}
      <div
        className="fixed top-6 right-6 z-50 bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-6 py-3 rounded-full shadow-2xl shadow-red-500/60 border border-red-400"
        style={{ pointerEvents: "none" }}
      >
        <span className="text-white font-bold text-sm drop-shadow-md">
          {categories.find((c) => c.id === selectedCategory)?.icon}{" "}
          {categories.find((c) => c.id === selectedCategory)?.name}
        </span>
      </div>

      {/* Category Sidebar */}
      <CategorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div
        className="min-h-screen flex flex-col relative"
        style={{ position: "relative", zIndex: 5, pointerEvents: "none" }}
      >
        <div className="grow" style={{ pointerEvents: "none" }}></div>

        {/* MENU BAR */}
        <div
          className="overflow-x-auto"
          ref={menuRef}
          style={{
            scrollSnapType: "x mandatory",
            position: "absolute",
            bottom: 20,
            left: 0,
            width: "100%",
            zIndex: 50,
            background: "transparent",
            pointerEvents: "auto",
            paddingBottom: "12px",
          }}
        >
          <div className="p-2 whitespace-nowrap flex" style={{ pointerEvents: "auto" }}>
            {menus.map((item) => (
              <MenuCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARMenuCards;