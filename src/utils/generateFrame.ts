interface FrameOptions {
  image: string;
  zoom: number;
  position: {
    x: number;
    y: number;
  };
}

export async function generateFrame({
  image,
  zoom,
  position,
}: FrameOptions): Promise<Blob> {
  const canvas = document.createElement("canvas");

  const SIZE = 1080;

  canvas.width = SIZE;
  canvas.height = SIZE;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not supported.");
  }

  const img = await loadImage(image);

  /*
   * Background
   */
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(0, 0, SIZE, SIZE);

  /*
   * Calculate cover crop
   */
  const scale = Math.max(
    SIZE / img.naturalWidth,
    SIZE / img.naturalHeight
  );

  const width = img.naturalWidth * scale * zoom;
  const height = img.naturalHeight * scale * zoom;

  const x = (SIZE - width) / 2 + position.x * (SIZE / 480);
  const y = (SIZE - height) / 2 + position.y * (SIZE / 480);

  /*
   * Draw photo
   */
  ctx.save();

  ctx.beginPath();
  ctx.rect(0, 0, SIZE, SIZE);
  ctx.clip();

  ctx.drawImage(img, x, y, width, height);

  ctx.restore();

  /*
   * HH Goa frame
   */
  const BORDER = 28;

  ctx.strokeStyle = "#b7ff48";
  ctx.lineWidth = BORDER;

  ctx.strokeRect(
    BORDER / 2,
    BORDER / 2,
    SIZE - BORDER,
    SIZE - BORDER
  );

  /*
   * Top branding
   */
  ctx.fillStyle = "#b7ff48";
  ctx.font = "500 26px monospace";
  ctx.textBaseline = "top";

  ctx.fillText("HH GOA '26", 65, 65);

  /*
   * Bottom branding
   */
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";

  ctx.fillText("#FrameInGoa", SIZE - 65, SIZE - 65);

  /*
   * Convert to PNG
   */
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to generate image."));
        }
      },
      "image/png",
      1
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image."));

    img.src = src;
  });
}