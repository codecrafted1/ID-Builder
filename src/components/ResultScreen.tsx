interface ResultScreenProps {
  imageUrl: string;
  imageBlob: Blob;
  onCreateAnother: () => void;
}

function ResultScreen({
  imageUrl,
  imageBlob,
  onCreateAnother,
}: ResultScreenProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(imageBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "HH-Goa-2026-Frame.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const file = new File(
      [imageBlob],
      "HH-Goa-2026-Frame.png",
      {
        type: "image/png",
      }
    );

    const shareText =
      "Just framed my builder identity for HH Goa 2026 🌴 #FrameInGoa";

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          text: shareText,
          title: "HH Goa 2026",
        });

        return;
      }

      const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}`;

      window.open(xUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") {
        console.error("Share failed:", error);

        const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}`;

        window.open(xUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <section className="result-section">
      <div className="result-content">
        <p className="eyebrow">03 / READY</p>

        <h1>
          You're
          <br />
          <span>framed.</span>
        </h1>

        <p className="result-description">
          Your HH Goa 2026 builder frame is ready
          <br />
          to download and share.
        </p>

        <div className="result-actions">
          <button
            type="button"
            className="generate-button"
            onClick={handleDownload}
          >
            <span>Download Image</span>
            <span>↓</span>
          </button>

          <button
            type="button"
            className="share-button"
            onClick={handleShare}
          >
            <span>Share on X</span>
            <span>↗</span>
          </button>
        </div>

        <button
          type="button"
          className="another-button"
          onClick={onCreateAnother}
        >
          ← Create another
        </button>
      </div>

     <div className="result-preview">
  <img
    src={imageUrl}
    alt="Your HH Goa 2026 generated frame"
  />

  <div className="result-frame-overlay">
    <span>HH GOA '26</span>
    <span>#FrameInGoa</span>
  </div>
</div>
    </section>
  );
}

export default ResultScreen;