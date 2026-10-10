import { useEffect, useRef } from 'react';

const cubeVerts = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

const cubeFaces = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 1, 5, 4],
  [2, 3, 7, 6],
  [0, 3, 7, 4],
  [1, 2, 6, 5],
];

const shapes = [
  { x: -90, y: -70, z: 20, size: 34, spin: [0.7, 0.9, 0.2], phase: 0.2, colors: ['#ff4d8d', '#7a5cff', '#3ec6ff', '#ffb703', '#2ee59d', '#ff6b4a'] },
  { x: 100, y: -40, z: 80, size: 26, spin: [0.5, -0.8, 0.4], phase: 1.4, colors: ['#3ec6ff', '#2ee59d', '#ffb703', '#ff4d8d', '#c77dff', '#ffd166'] },
  { x: 70, y: 90, z: -10, size: 42, spin: [0.35, 0.55, -0.25], phase: 2.2, colors: ['#ffb703', '#ff6b4a', '#ff4d8d', '#3ec6ff', '#7a5cff', '#2ee59d'] },
  { x: -80, y: 80, z: 60, size: 22, spin: [-0.9, 0.4, 0.6], phase: 0.8, colors: ['#2ee59d', '#3ec6ff', '#7a5cff', '#ff4d8d', '#ffb703', '#80ffdb'] },
  { x: 10, y: 10, z: 120, size: 30, spin: [0.45, 0.7, 0.55], phase: 3.1, colors: ['#c77dff', '#ff4d8d', '#ffb703', '#3ec6ff', '#2ee59d', '#ff8fab'] },
];

const rings = [
  { x: -40, y: 20, z: 40, radius: 58, spin: [0.6, 0.35, 0.15], phase: 0.4, color: '#3ec6ff' },
  { x: 80, y: -80, z: 10, radius: 36, spin: [0.25, 0.8, 0.4], phase: 1.7, color: '#ff4d8d' },
  { x: -10, y: 70, z: 90, radius: 48, spin: [0.9, 0.2, 0.3], phase: 2.6, color: '#ffb703' },
];

function rotate([x, y, z], ax, ay, az) {
  let cy = Math.cos(ax);
  let sy = Math.sin(ax);
  let y1 = y * cy - z * sy;
  let z1 = y * sy + z * cy;
  y = y1;
  z = z1;

  cy = Math.cos(ay);
  sy = Math.sin(ay);
  const x1 = x * cy + z * sy;
  z1 = -x * sy + z * cy;
  x = x1;
  z = z1;

  cy = Math.cos(az);
  sy = Math.sin(az);
  return [x * cy - y * sy, x * sy + y * cy, z];
}

function project(x, y, z, width, height) {
  const depth = 420;
  const scale = depth / (depth + z);
  return [width / 2 + x * scale, height / 2 + y * scale, z];
}

function paintBackdrop(ctx, width, height, time) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#2a1544');
  gradient.addColorStop(0.5, '#12344a');
  gradient.addColorStop(1, '#123024');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const orbs = [
    [width * 0.12, height * 0.2, 78, 'rgba(255, 77, 141, 0.55)'],
    [width * 0.86, height * 0.72, 90, 'rgba(62, 198, 255, 0.5)'],
    [width * 0.48, height * 0.55, 70, 'rgba(255, 183, 3, 0.38)'],
  ];

  orbs.forEach(([x, y, radius, color], index) => {
    const drift = Math.sin(time * 0.6 + index) * 12;
    const glow = ctx.createRadialGradient(x + drift, y, 8, x + drift, y, radius);
    glow.addColorStop(0, color);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x + drift, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function collectCube(faces, shape, time, width, height) {
  const angle = time + shape.phase;
  const origin = [
    shape.x + Math.sin(angle * 0.7) * 18,
    shape.y + Math.cos(angle * 0.55) * 16,
    shape.z + Math.sin(angle * 0.35) * 24,
  ];

  const points = cubeVerts.map((vertex) => {
    const spun = rotate(
      vertex.map((coord, index) => coord * shape.size),
      angle * shape.spin[0],
      angle * shape.spin[1],
      angle * shape.spin[2],
    );
    return project(spun[0] + origin[0], spun[1] + origin[1], spun[2] + origin[2], width, height);
  });

  cubeFaces.forEach((face, index) => {
    const corners = face.map((vertex) => points[vertex]);
    const depth = corners.reduce((sum, corner) => sum + corner[2], 0) / corners.length;
    faces.push({ corners, depth, color: shape.colors[index] });
  });
}

function drawRing(ctx, ring, time, width, height) {
  const angle = time * 0.8 + ring.phase;
  const origin = [
    ring.x + Math.cos(angle) * 10,
    ring.y + Math.sin(angle * 0.8) * 14,
    ring.z,
  ];
  const segments = 36;
  ctx.beginPath();
  for (let index = 0; index <= segments; index += 1) {
    const theta = (index / segments) * Math.PI * 2;
    const spun = rotate(
      [Math.cos(theta) * ring.radius, 0, Math.sin(theta) * ring.radius],
      angle * ring.spin[0],
      angle * ring.spin[1],
      angle * ring.spin[2],
    );
    const [x, y] = project(spun[0] + origin[0], spun[1] + origin[1], spun[2] + origin[2], width, height);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = ring.color;
  ctx.lineWidth = 6;
  ctx.stroke();
}

export function ChatScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    const context = canvas.getContext('2d');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frameId = 0;

    const draw = (now) => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const ratio = window.devicePixelRatio || 1;
      if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const time = motionQuery.matches ? 0.8 : now / 1000;
      paintBackdrop(context, width, height, time);

      rings.forEach((ring) => drawRing(context, ring, time, width, height));

      const faces = [];
      shapes.forEach((shape) => collectCube(faces, shape, time, width, height));
      faces.sort((left, right) => right.depth - left.depth);
      faces.forEach((face) => {
        context.beginPath();
        face.corners.forEach((corner, index) => {
          if (index === 0) context.moveTo(corner[0], corner[1]);
          else context.lineTo(corner[0], corner[1]);
        });
        context.closePath();
        context.fillStyle = face.color;
        context.fill();
        context.strokeStyle = 'rgba(255, 255, 255, 0.38)';
        context.lineWidth = 1;
        context.stroke();
      });

      if (!motionQuery.matches) frameId = window.requestAnimationFrame(draw);
    };

    frameId = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return <canvas ref={canvasRef} className="chat-scene" />;
}
