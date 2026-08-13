import { useRef, useState } from "react";
import { generateFrame } from "../utils/generateFrame";

interface PhotoEditorProps {
  image: string;
  onReset: () => void;
  onGenerated: (imageUrl: string, blob: Blob) => void;
}

function PhotoEditor({
  image,
  onReset,
  onGenerated,
}: PhotoEditorProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isGenerating, setIsGenerating] = useState(false);

  const dragging = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    dragging.current = true;

    startPoint.current = {
      x: event.clientX,
      y: event.clientY,
    };

    startPosition.current = position;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!dragging.current) return;

    const deltaX = event.clientX - startPoint.current.x;
    const deltaY = event.clientY - startPoint.current.y;

    setPosition({
      x: startPosition.current.x + deltaX,
      y: startPosition.current.y + deltaY,
    });
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    dragging.current = false;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released.
    }
  };

  const resetPosition = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);

      const blob = await generateFrame({
        image,
        zoom,
        position,
      });

      const imageUrl = URL.createObjectURL(blob);

      onGenerated(imageUrl, blob);
    } catch (error) {
      console.error("Image generation failed:", error);

      alert(
        "Something went wrong while generating your image. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="editor">
      <div
        className="editor-preview"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          src={image}
          alt="Your uploaded photo"
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          }}
        />

        <div className="frame-overlay">
          <span>HH GOA '26</span>
          <span>#FrameInGoa</span>
        </div>
      </div>

      <div className="controls">
        <div className="control">
          <div className="control-header">
            <span>ZOOM</span>
            <span>{zoom.toFixed(1)}×</span>
          </div>

          <input
            type="range"
            min="1"
            max="2.5"
            step="0.01"
            value={zoom}
            onChange={(event) =>
              setZoom(Number(event.target.value))
            }
            aria-label="Zoom photo"
          />
        </div>

        <div className="editor-actions">
          <button
            type="button"
            className="reset-button"
            onClick={resetPosition}
          >
            Reset
          </button>

          <button
            type="button"
            className="change-button"
            onClick={onReset}
          >
            Choose another photo
          </button>
        </div>

        <button
          type="button"
          className="generate-button"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <span>
            {isGenerating
              ? "Generating..."
              : "Generate Your Frame"}
          </span>

          <span>↗</span>
        </button>
      </div>

      <p className="editor-hint">
        Drag the photo to adjust its position
      </p>
    </div>
  );
}

export default PhotoEditor;