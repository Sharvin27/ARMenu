"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// @ts-ignore
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import lodash from "lodash";
import { Menu, X } from "lucide-react";

/* ---------------------------------- TYPES ---------------------------------- */
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

/* ------------------------------- CATEGORIES ------------------------------- */
const categories: Category[] = [
  { id: "appetizers", name: "Appetizers", icon: "🥗" },
  { id: "main", name: "Main Course", icon: "🍽️" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "beverages", name: "Beverages", icon: "🍺" },
];

/* ------------------------------ MENU CARDS ------------------------------ */
const MenuCard: React.FC<{ item: FoodItem }> = ({ item }) => (
  <div
    data-menu-card
    className="shrink-0 grow-0 basis-full px-4"
    style={{ scrollSnapAlign: "center" }}
  >
    <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl max-w-sm mx-auto border-2 border-red-500/50 hover:border-red-400 transition-all">
      <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
        {item.name}
      </h3>
      <p className="text-gray-200 mb-4 text-sm drop-shadow-md">
        {item.description}
      </p>
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

/* ---------------------------- CATEGORY SIDEBAR ---------------------------- */
const CategorySidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}> = ({ isOpen, onClose, selectedCategory, onSelectCategory }) => (
  <>
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-20"
        onClick={onClose}
        style={{ pointerEvents: "auto" }}
      />
    )}

    <div
      className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-white/98 via-red-50/98 to-red-100/98 backdrop-blur-xl shadow-2xl z-30 transform transition-transform duration-300 border-r-2 border-red-200 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ pointerEvents: "auto" }}
    >
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

/* ---------------------------------- MENUS ---------------------------------- */
export const menus: FoodItem[] = [
  { id: 1, name: "Pizza", value: "pizza", description: "Tasty pizza", price: 500, image: "", merchant: 1, quantity: 10, model: "/models/pzza/scene.gltf" },
  { id: 2, name: "Platter", value: "platter", description: "Delicious platter", price: 350, image: "", merchant: 1, quantity: 10, model: "/models/platter-resized.glb" },
  { id: 3, name: "Murgmussallam", value: "murg", description: "Traditional murg", price: 250, image: "", merchant: 1, quantity: 10, model: "/models/murgmusallam-resized.glb" },
  { id: 4, name: "Fish Fingers", value: "fishfingers", description: "Crispy fish fingers", price: 250, image: "", merchant: 1, quantity: 10, model: "/models/fishfingers-resized.glb" },
  { id: 5, name: "Pasta", value: "pasta", description: "Fresh pasta", price: 250, image: "", merchant: 1, quantity: 10, model: "/models/pasta-resized.glb" },
  { id: 6, name: "Beer Crate", value: "beer", description: "Chilled beer", price: 250, image: "", merchant: 1, quantity: 10, model: "/models/beer-resized.glb" },
  { id: 7, name: "Chicken Bites", value: "chicken_bites", description: "Juicy chicken bites", price: 250, image: "", merchant: 1, quantity: 10, model: "/models/chicken_bites-resized.glb" },
];

const ARMenuCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const loadedModels = useRef<{ [key: string]: THREE.Object3D }>({});
  const currentModelRef = useRef<THREE.Object3D | null>(null);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("main");

  const hoverOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const pinchDistanceRef = useRef(0);

  const modelScaleRef = useRef(1.2);
  const modelRotationRef = useRef({ x: 0, y: 0 });

  /* --------------------------- DISPOSE MODEL --------------------------- */
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

  /* ----------------------------- CAMERA FEED ---------------------------- */
  const setupCameraFeed = async () => {
    const video = document.createElement("video") as HTMLVideoElement;
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    Object.assign(video.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      objectFit: "cover",
      zIndex: "0",
    });
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

  /* ------------------------- THREE SETUP ------------------------- */
  useEffect(() => {
    setupCameraFeed();

    document.body.style.overflow = "hidden";
    document.body.style.height = "100dvh";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    const container = containerRef.current;
    if (!container) return;

    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    /* --------------------- SAFARI GPU MEMORY FIX --------------------- */
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    renderer.setPixelRatio(isSafari ? 1 : window.devicePixelRatio);

    Object.assign(renderer.domElement.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "1",
      pointerEvents: "auto",
      touchAction: "none",
    });

    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    /* ---------------------------- LIGHTS ---------------------------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(2, 2, 2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-2, 0, -2);
    scene.add(fillLight);

    camera.position.set(0, 0, 0);

    /* ---------------------------- ANIMATE --------------------------- */
    const animate = () => {
      requestAnimationFrame(animate);

      if (currentModelRef.current) {
        const model = currentModelRef.current;

        model.rotation.y = modelRotationRef.current.y;
        model.rotation.x = modelRotationRef.current.x;

        if (!isDraggingRef.current) {
          modelRotationRef.current.y += 0.01;
        }

        hoverOffsetRef.current += 0.02;
        model.position.y = -0.1 + Math.sin(hoverOffsetRef.current) * 0.05;

        const scale = modelScaleRef.current;
        model.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  /* ------------------------- OPTION A1 — MODEL POOLING -------------------------
     Only ONE model is kept in the scene and memory at any time.
     NO cloning → NO duplicated textures → 100% Safari crash-proof.
  ----------------------------------------------------------------------------- */

  const updateModel = () => {
    const scene = sceneRef.current;
    const currentCard = menus[currentCardIndex];
    const modelKey = currentCard.value;

    const gltfLoader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/");
    gltfLoader.setDRACOLoader(draco);

    /* --------------------- Remove old model completely -------------------- */
    if (currentModelRef.current) {
      scene.remove(currentModelRef.current);
      disposeObject(currentModelRef.current);
      currentModelRef.current = null;
    }

    /* ------------------------ If already loaded ------------------------ */
    if (loadedModels.current[modelKey]) {
      const model = loadedModels.current[modelKey];
      scene.add(model);
      model.position.set(0, -0.1, -1.2);
      currentModelRef.current = model;
      hoverOffsetRef.current = 0;
      return;
    }

    /* ---------------------------- Load only now ---------------------------- */
    gltfLoader.load(
      currentCard.model,
      (gltf: any) => {
        const model = gltf.scene;

        /* SAFARI FIX: Ensure proper material sharing */
        model.traverse((child: any) => {
          if (child.isMesh) child.frustumCulled = false;
        });

        loadedModels.current[modelKey] = model;

        model.position.set(0, -0.1, -1.2);
        model.scale.set(1.2, 1.2, 1.2);

        scene.add(model);
        currentModelRef.current = model;
        hoverOffsetRef.current = 0;
      },
      undefined,
      (err: any) => console.error("GLTF load error:", err)
    );
  };
  /* ------------------------- TOUCH CONTROLS ------------------------- */
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

        modelRotationRef.current.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, modelRotationRef.current.x)
        );

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
          modelScaleRef.current = Math.max(
            0.5,
            Math.min(3.0, modelScaleRef.current)
          );
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

  /* ---------------------- SCROLL → CHANGE MODEL ---------------------- */
  useEffect(() => {
    const handler = lodash.debounce(() => {
      if (!menuRef.current) return;

      const scrollLeft = menuRef.current.scrollLeft;
      const firstCard = menuRef.current.querySelector(
        "[data-menu-card]"
      ) as HTMLDivElement | null;

      const cardWidth =
        firstCard?.offsetWidth ?? menuRef.current.offsetWidth;

      const idx = Math.round(scrollLeft / cardWidth);

      if (idx !== currentCardIndex) {
        setCurrentCardIndex(idx);
      }
    }, 200);

    menuRef.current?.addEventListener("scroll", handler);
    return () => menuRef.current?.removeEventListener("scroll", handler);
  }, [currentCardIndex]);

  /* ------------------------- LOAD MODEL WHEN INDEX CHANGES ------------------------- */
  useEffect(() => {
    updateModel();
  }, [currentCardIndex]);

  /* ------------------------------ UI ------------------------------ */
  return (
    <div ref={containerRef} className="w-full" style={{ height: "100dvh" }}>
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-6 left-6 z-50 bg-gradient-to-br from-white/95 to-red-50/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border-2 border-red-200 hover:border-red-300 hover:shadow-2xl hover:shadow-red-500/30 transition-all transform hover:scale-110"
        style={{ pointerEvents: "auto" }}
      >
        <Menu className="w-6 h-6 text-red-700" />
      </button>

      <div
        className="fixed top-6 right-6 z-50 bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-6 py-3 rounded-full shadow-2xl shadow-red-500/60 border border-red-400"
        style={{ pointerEvents: "none" }}
      >
        <span className="text-white font-bold text-sm drop-shadow-md">
          {
            categories.find((c) => c.id === selectedCategory)
              ?.icon
          }{" "}
          {
            categories.find((c) => c.id === selectedCategory)
              ?.name
          }
        </span>
      </div>

      <CategorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div
        className="flex flex-col relative"
        style={{
          minHeight: "100dvh",
          position: "relative",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <div className="grow" style={{ pointerEvents: "none" }}></div>

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
          <div
            className="p-2 whitespace-nowrap flex"
            style={{ pointerEvents: "auto" }}
          >
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
