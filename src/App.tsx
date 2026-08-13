import { useEffect, useState } from "react";
import PhotoEditor from "./components/PhotoEditor";
import ResultScreen from "./components/ResultScreen";
import "./App.css";

const originalText = "UPLOAD YOUR PHOTO";
const characters = "!<>-_\\/[]{}—=+*^?#________";

function scrambleText(text: string): string {
  return text
    .split("")
    .map((char) => {
      if (char === " ") return " ";

      return characters[
        Math.floor(Math.random() * characters.length)
      ];
    })
    .join("");
}

function App() {
  const [image, setImage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [generatedImage, setGeneratedImage] =
    useState<string | null>(null);

  const [generatedBlob, setGeneratedBlob] =
    useState<Blob | null>(null);

  const [buttonText, setButtonText] =
    useState(originalText);

  const [isScrambling, setIsScrambling] =
    useState(false);

  /* =========================
     SCRAMBLE UPLOAD TEXT
  ========================= */

  const runScramble = () => {
    if (isScrambling) return;

    setIsScrambling(true);

    let iteration = 0;

    const interval = setInterval(() => {
      setButtonText(scrambleText(originalText));

      iteration++;

      if (iteration >= 8) {
        clearInterval(interval);

        setButtonText(originalText);
        setIsScrambling(false);
      }
    }, 60);
  };

  useEffect(() => {
    return () => {
      setButtonText(originalText);
    };
  }, []);

  /* =========================
     UPLOAD PHOTO
  ========================= */

  const handleUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);

    setGeneratedImage(null);
    setGeneratedBlob(null);

    // Reset file input so the same image can be selected again
    event.target.value = "";
  };

  /* =========================
     GENERATED IMAGE
  ========================= */

  const handleGenerated = (
    imageUrl: string,
    blob: Blob
  ) => {
    setGeneratedImage(imageUrl);
    setGeneratedBlob(blob);
  };

  /* =========================
     RESET EVERYTHING
  ========================= */

  const handleReset = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }

    if (generatedImage) {
      URL.revokeObjectURL(generatedImage);
    }

    setImage(null);

    setGeneratedImage(null);
    setGeneratedBlob(null);

    setName("");
    setRole("");

    setButtonText(originalText);
    setIsScrambling(false);
  };

  return (
    <main className="app">
      {/* =========================
          ROBOTIC BACKGROUND
      ========================= */}

      <div className="grid-background" />
      <div className="scan-line" />

      {/* =========================
          LANDING / UPLOAD
      ========================= */}

      {!image && !generatedImage && (
        <section className="landing">
          {/* SYSTEM LABEL */}

          <div className="system-label">
            <span className="status-dot" />

            HH_GOA_2026 // ID-BUILDER
          </div>

          <div className="hero">
            {/* =========================
                HERO CONTENT
            ========================= */}

            <div className="hero-content">
              <p className="eyebrow">
                [ IDENTITY_PROTOCOL_01 ]
              </p>

              <h1>
                BUILD YOUR
                <br />

                <span>IDENTITY.</span>
              </h1>

              <div className="title-line">
                <span />

                <p>
                  TURN YOUR PHOTO INTO A
                  <br />
                  HH GOA 2026 BUILDER FRAME.
                </p>
              </div>

              {/* =========================
                  USER DETAILS
              ========================= */}

              <div className="identity-fields">
                {/* NAME */}

                <div className="identity-field">
                  <label htmlFor="builder-name">
                    NAME
                  </label>

                  <input
                    id="builder-name"
                    type="text"
                    placeholder="ENTER YOUR NAME"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    maxLength={30}
                    autoComplete="name"
                  />
                </div>

                {/* STACK / ROLE */}

                <div className="identity-field">
                  <label htmlFor="builder-role">
                    STACK / ROLE
                  </label>

                  <input
                    id="builder-role"
                    type="text"
                    placeholder="E.G. REACT DEVELOPER"
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value)
                    }
                    maxLength={35}
                  />
                </div>
              </div>

              {/* =========================
                  UPLOAD BUTTON
              ========================= */}

              <label
                className="upload-button"
                onMouseEnter={runScramble}
                onClick={runScramble}
              >
                <span
                  className={
                    isScrambling
                      ? "scrambling"
                      : ""
                  }
                >
                  {buttonText}
                </span>

                <span className="upload-arrow">
                  ↗
                </span>

                <input
                  type="file"
                  accept="
                    image/jpeg,
                    image/png,
                    image/heic,
                    image/heif
                  "
                  onChange={handleUpload}
                  hidden
                />
              </label>

              {/* FILE INFO */}

              <div className="upload-meta">
                <span>JPG</span>
                <span>PNG</span>
                <span>HEIC</span>
                <span>NO SIGNUP</span>
              </div>
            </div>

            {/* =========================
                ROBOT VISUAL
            ========================= */}

            <div className="robot-visual">
              <div className="robot-ring ring-one" />

              <div className="robot-ring ring-two" />

              <div className="robot-core">
                <div className="core-eye" />

                <div className="core-eye" />
              </div>

              {/* CORNERS */}

              <div className="corner corner-tl" />
              <div className="corner corner-tr" />
              <div className="corner corner-bl" />
              <div className="corner corner-br" />

              {/* LABELS */}

              <span className="visual-label label-top">
                SYSTEM READY
              </span>

              <span className="visual-label label-bottom">
                01 / 03
              </span>
            </div>
          </div>
        </section>
      )}

      {/* =========================
          PHOTO EDITOR
      ========================= */}

      {image && !generatedImage && (
        <section className="editor-section">
          <div className="editor-heading">
            <p className="eyebrow">
              [ IDENTITY_PROTOCOL_02 ]
            </p>

            <h2>
              CONFIGURE
              <br />

              <span>YOUR ID.</span>
            </h2>

            {/* USER DETAILS SUMMARY */}

            {(name || role) && (
              <div className="identity-summary">
                {name && (
                  <span>{name}</span>
                )}

                {role && (
                  <span>{role}</span>
                )}
              </div>
            )}
          </div>

          <PhotoEditor
            image={image}
            onReset={handleReset}
            onGenerated={handleGenerated}
          />
        </section>
      )}

      {/* =========================
          RESULT SCREEN
      ========================= */}

      {generatedImage && generatedBlob && (
        <ResultScreen
          imageUrl={generatedImage}
          imageBlob={generatedBlob}
          onCreateAnother={handleReset}
        />
      )}

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="site-footer">
        {/* LEFT */}

        <div>
          <span className="footer-highlight">
            HH GOA 2026
          </span>

          <span> // ID-BUILDER</span>
        </div>

        {/* CENTER */}

        <div className="footer-center">
          BUILD · SHIP · CONNECT
        </div>

        {/* RIGHT */}

        <div className="footer-right">
          <span>STATUS:</span>

          <span className="online">
            ONLINE
          </span>

          <span>
            {" "}
            // #FrameInGoa
          </span>
        </div>
      </footer>
    </main>
  );
}

export default App;