'use client';
import React, { useEffect, useRef, useState } from "react";
import "./styles.css";

export default function AnimatedHeart() {
  const [opened, setOpened] = useState(false);
  const [showFinal, setShowFinal] = useState(false); // after sparkles
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!opened || showFinal) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = 600, H = 600;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2, cy = H / 2;

    let crossFrame = 0;
    const crossFramesTotal = 40;
    let k = 0;
    const steps = 220;

    let beatScale = 1;
    let growing = true;
    const beatDeltaGrow = 0.0035;
    const beatMax = 1.08, beatMin = 0.96;
    let beatCount = 0;

    let bursting = false;
    let particles = [];

    function heartXY(t) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);
      return { x, y };
    }

    function drawBackground() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
    }

    function drawCross(progress) {
      const halfLen = progress * Math.min(W, H) * 0.4;
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - halfLen, cy);
      ctx.lineTo(cx + halfLen, cy);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy - halfLen);
      ctx.lineTo(cx, cy + halfLen);
      ctx.stroke();
    }

    function drawHeartLines(scale = 1) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1.5;
      const n = Math.min(k, steps);
      for (let i = 0; i <= n; i++) {
        const t = (i / steps) * Math.PI;
        const ts = i === 0 ? [t] : [t, -t];
        for (const tt of ts) {
          const { x, y } = heartXY(tt);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + x * 15 * scale, cy - y * 15 * scale);
          ctx.stroke();
        }
      }
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 100 + Math.random() * 50,
          color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        });
      }
    }

    function drawParticles() {
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life--;
      });
      particles = particles.filter(p => p.life > 0);
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      drawBackground();

      if (crossFrame < crossFramesTotal) {
        drawCross(crossFrame / crossFramesTotal);
        crossFrame++;
        requestAnimationFrame(animate);
        return;
      }

      if (k <= steps) {
        drawHeartLines(1);
        k++;
        requestAnimationFrame(animate);
        return;
      }

      if (!bursting) {
        if (growing) {
          beatScale += beatDeltaGrow;
          if (beatScale >= beatMax) {
            growing = false;
            beatCount++;
          }
        } else {
          beatScale -= beatDeltaGrow;
          if (beatScale <= beatMin) {
            growing = true;
          }
        }

        drawHeartLines(beatScale);

        if (beatCount >= 3) {
          bursting = true;
          createParticles();
        }
      } else {
        drawParticles();
        if (particles.length === 0) {
          setShowFinal(true);
          return;
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }, [opened, showFinal]);

  return (
    <div className={`stage ${opened ? "dark" : "light"}`}>
      {!opened ? (
        <div className="gift-wrap">
          <div
            className="gift-emoji"
            onClick={() => setOpened(true)}
            role="button"
            aria-label="Open gift"
            title="Open your surprise"
          >
            🎁
          </div>
          <p className="gift-caption">
            Tap the gift, my sweet OneA ❤️
          </p>
        </div>
      ) : showFinal ? (
        <div className="final-message">
  <h1>Happy Birthday My Love ❤️🎉</h1>
  <p>
    To my favorite man ,
    wish you the happiest birthday.<br />
    hope to celebrate countless more birthdays 
    by your side loving and laughing in your arms. <br />
    knd ni ibyagaciro kuba nkufite mu buzima bwanjye.
    you make my life better.<br />
    and I will continue loving you and calling you mine 
    Every smile,every gentle touch from you  
    makes my world brighter.  <br />
    On this special day, I wish for you all the joy, laughter, and love  
    that you have brought into my life.  
    You will forever be my man.  <br />
    Happy birthday, my love—today and always, I am yours. 💖✨
  </p>
  <div className="floating-hearts"></div>
</div>

      ) : (
        <canvas ref={canvasRef} className="heart-canvas" />
      )}
    </div>
  );
}
