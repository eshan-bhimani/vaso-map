import { useEffect, useRef } from 'react';
import { getVesselTypeColor } from '../../utils/graphUtils';

interface Props {
  vesselType: string;
  vesselName: string;
}

/**
 * Stylized vessel preview using Canvas 2D API.
 * Renders an animated, glowing tube cross-section with orbiting particles.
 */
export function ThreePreview({ vesselType, vesselName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const color = getVesselTypeColor(vesselType);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    let t = 0;

    // Parse hex to rgba
    const hexToRgba = (hex: string, a: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    };

    // Tube path: a sinusoidal curve across canvas
    const getTubePoints = (phase: number) => {
      const pts: Array<[number, number]> = [];
      for (let i = 0; i <= 80; i++) {
        const x = (i / 80) * W;
        const y = H / 2 + Math.sin((i / 80) * Math.PI * 2.5 + phase) * (H * 0.18);
        pts.push([x, y]);
      }
      return pts;
    };

    const drawTube = (pts: Array<[number, number]>, thickness: number, alpha: number, blur: number) => {
      ctx.save();
      ctx.filter = `blur(${blur}px)`;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i][0], pts[i][1]);
      }
      ctx.strokeStyle = hexToRgba(color, alpha);
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.filter = 'none';
      ctx.restore();
    };

    const particles: Array<{ progress: number; speed: number; size: number; opacity: number }> = Array.from({ length: 14 }, (_, i) => ({
      progress: i / 14,
      speed: 0.003 + Math.random() * 0.003,
      size: 2.5 + Math.random() * 2.5,
      opacity: 0.6 + Math.random() * 0.4,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Dark background
      ctx.fillStyle = '#080e1a';
      ctx.fillRect(0, 0, W, H);

      const pts = getTubePoints(t * 0.4);

      // Outer glow (wide, blurred)
      drawTube(pts, 24, 0.06, 12);
      // Mid glow
      drawTube(pts, 14, 0.18, 6);
      // Inner tube body
      drawTube(pts, 7, 0.65, 1);
      // Core highlight
      drawTube(pts, 2, 0.9, 0);

      // Particles flowing along tube
      particles.forEach((p) => {
        p.progress = (p.progress + p.speed) % 1;
        const idx = Math.floor(p.progress * (pts.length - 1));
        const pt = pts[idx];
        if (!pt) return;

        // Outer glow
        const grad = ctx.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], p.size * 3);
        grad.addColorStop(0, hexToRgba(color, p.opacity * 0.8));
        grad.addColorStop(1, hexToRgba(color, 0));
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], p.size, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, p.opacity);
        ctx.fill();
      });

      // Scanline overlay for depth
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      for (let y = 0; y < H; y += 4) {
        ctx.fillRect(0, y, W, 1);
      }

      // Vignette
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.8);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      t += 0.025;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [color]);

  return (
    <div
      className="w-full rounded-xl overflow-hidden relative"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <canvas
        ref={canvasRef}
        width={480}
        height={180}
        className="w-full block"
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Labels */}
      <div className="absolute top-3 left-3">
        <div className="label-mono" style={{ color }}>
          {vesselType.toLowerCase()} · live simulation
        </div>
      </div>
      <div className="absolute bottom-3 right-3">
        <div className="label-mono text-right" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {vesselName}
        </div>
      </div>
      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}55, transparent)` }}
      />
    </div>
  );
}
