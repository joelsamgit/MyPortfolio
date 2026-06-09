import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Scene = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const frameRequestRef = useRef<number | null>(null);
  const { setLoading } = useLoading();
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const getFramePath = (index: number) => {
    const paddedIndex = String(index).padStart(2, "0");
    const delay = index % 3 === 1 ? "0.066s" : "0.067s";
    return `/sequence/frame_${paddedIndex}_delay-${delay}.png`;
  };

  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) * 0.12; // Shift down: crop only 12% from the top
    } else {
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }

    // Force high-quality image smoothing algorithms (bicubic/Lanczos)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw at whole integer pixel offsets to completely bypass blurry sub-pixel antialiasing
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(
      img,
      Math.round(offsetX),
      Math.round(offsetY),
      Math.round(drawWidth),
      Math.round(drawHeight)
    );
  };

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (img && img.complete) {
      drawImageCover(ctx, img, canvas.width, canvas.height);
      currentFrameRef.current = index;
    }
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    drawFrame(currentFrameRef.current);
  };

  // Preload all frames on mount
  useEffect(() => {
    let progress = setProgress((value) => setLoading(value));
    const totalFrames = 96;
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          progress.loaded().then(() => {
            setAllImagesLoaded(true);
          });
        }
      };
      img.onerror = () => {
        console.error(`Failed to load frame: ${img.src}`);
        loadedCount++;
        if (loadedCount === totalFrames) {
          progress.loaded().then(() => {
            setAllImagesLoaded(true);
          });
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      if (frameRequestRef.current !== null) {
        cancelAnimationFrame(frameRequestRef.current);
      }
    };
  }, []);

  // Initialize Canvas and Timelines once preloading is complete
  useEffect(() => {
    if (allImagesLoaded) {
      resizeCanvas();
      drawFrame(0);
      setCharTimeline();
      setAllTimeline();
      ScrollTrigger.refresh();
    }
  }, [allImagesLoaded]);



  // Track window resizing and refresh GSAP timelines
  useEffect(() => {
    if (!allImagesLoaded) return;

    const handleResize = () => {
      resizeCanvas();

      // Clear GSAP triggers (except "work") and rebuild
      const workTrigger = ScrollTrigger.getById("work");
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger !== workTrigger) {
          trigger.kill();
        }
      });
      setCharTimeline();
      setAllTimeline();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [allImagesLoaded]);

  // Framer Motion Scroll Integration
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!allImagesLoaded) return;

    const whatIDoElement = document.querySelector(".whatIDO") as HTMLElement;
    if (!whatIDoElement) return;

    // Speed up playback by 2x by dividing the target scroll height by 2
    const bottom = (whatIDoElement.offsetTop + whatIDoElement.offsetHeight) / 2;
    const progress = Math.max(0, Math.min(1, latest / bottom));
    const targetFrame = Math.round(progress * 95);

    if (frameRequestRef.current !== null) {
      cancelAnimationFrame(frameRequestRef.current);
    }

    frameRequestRef.current = requestAnimationFrame(() => {
      drawFrame(targetFrame);
      frameRequestRef.current = null;
    });
  });

  return (
    <div className={`character-container ${allImagesLoaded ? "character-loaded" : ""}`}>
      <div className="character-model" ref={containerRef}>
        <canvas ref={canvasRef} style={{ pointerEvents: "none" }} />
        <div className="character-rim"></div>
      </div>
    </div>
  );
};

export default Scene;
