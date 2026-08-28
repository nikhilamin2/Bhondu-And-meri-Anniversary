'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  type: 'heart' | 'sparkle' | 'bokeh';
  hue: number;
  angle: number;
  spin: number;
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(45, Math.floor(width / 25));
    const particles: Particle[] = [];

    const createParticle = (initialRandomY = false): Particle => {
      const types: ('heart' | 'sparkle' | 'bokeh')[] = ['heart', 'heart', 'sparkle', 'bokeh'];
      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height + 20,
        size: Math.random() * 8 + 6,
        speedY: -(Math.random() * 0.5 + 0.3),
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.2,
        fadeSpeed: (Math.random() * 0.005 + 0.002),
        type: types[Math.floor(Math.random() * types.length)],
        hue: Math.random() > 0.4 ? 345 : 355, // Rose / Crimson
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, hue: number) => {
      c.save();
      c.translate(x, y);
      c.scale(size / 15, size / 15);
      c.beginPath();
      // Smooth bezier heart curve
      c.moveTo(0, 0);
      c.bezierCurveTo(-5, -7, -12, -7, -12, 0);
      c.bezierCurveTo(-12, 6, -3, 11, 0, 15);
      c.bezierCurveTo(3, 11, 12, 6, 12, 0);
      c.bezierCurveTo(12, -7, 5, -7, 0, 0);
      c.closePath();

      c.fillStyle = `hsla(${hue}, 85%, 65%, ${opacity})`;
      c.shadowColor = `hsla(${hue}, 90%, 60%, ${opacity * 0.8})`;
      c.shadowBlur = 10;
      c.fill();
      c.restore();
    };

    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      c.save();
      c.translate(x, y);
      c.beginPath();
      c.arc(0, 0, size * 0.35, 0, Math.PI * 2);
      c.fillStyle = `rgba(255, 230, 240, ${opacity})`;
      c.shadowColor = 'rgba(255, 180, 200, 0.8)';
      c.shadowBlur = 8;
      c.fill();
      c.restore();
    };

    const drawBokeh = (c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      c.save();
      c.beginPath();
      c.arc(x, y, size * 1.5, 0, Math.PI * 2);
      c.fillStyle = `rgba(225, 29, 72, ${opacity * 0.15})`;
      c.shadowColor = 'rgba(244, 63, 94, 0.3)';
      c.shadowBlur = 20;
      c.fill();
      c.restore();
    };

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.y * 0.01) * 0.25;
        p.angle += p.spin;

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.opacity, p.hue);
        } else if (p.type === 'sparkle') {
          drawSparkle(ctx, p.x, p.y, p.size, p.opacity);
        } else {
          drawBokeh(ctx, p.x, p.y, p.size, p.opacity);
        }

        // Reset particle if offscreen or faded
        if (p.y < -30 || p.x < -30 || p.x > width + 30) {
          particles[idx] = createParticle(false);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particles-canvas"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
    />
  );
}
