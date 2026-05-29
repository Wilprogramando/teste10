'use client';

import { useEffect, useRef } from 'react';

type ShaderBackgroundProps = {
  className?: string;
};

export default function ShaderBackground({
  className = 'absolute inset-0 -z-10 h-full w-full',
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const vsSource = `
    attribute vec4 aVertexPosition;

    void main() {
      gl_Position = aVertexPosition;
    }
  `;

  const fsSource = `
    precision highp float;

    uniform vec2 iResolution;
    uniform float iTime;

    const float overallSpeed = 0.18;
    const float gridSmoothWidth = 0.015;

    const float minLineWidth = 0.01;
    const float maxLineWidth = 0.18;

    const float lineSpeed = 1.0 * overallSpeed;
    const float lineAmplitude = 1.0;
    const float lineFrequency = 0.22;

    const float warpSpeed = 0.2 * overallSpeed;
    const float warpFrequency = 0.5;
    const float warpAmplitude = 1.0;

    const float offsetFrequency = 0.5;
    const float offsetSpeed = 1.33 * overallSpeed;

    const float minOffsetSpread = 0.6;
    const float maxOffsetSpread = 2.0;

    const float scale = 5.0;
    const int linesPerGroup = 16;

    const vec4 lineColor = vec4(0.02, 0.55, 0.34, 1.0);

    #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
    #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
    #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))

    float random(float t) {
      return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
    }

    float getPlasmaY(float x, float horizontalFade, float offset) {
      return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      vec2 uv = fragCoord.xy / iResolution.xy;
      vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

      float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
      float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

      space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
      space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

      vec4 lines = vec4(0.0);

      vec4 bgColor1 = vec4(0.90, 1.00, 0.94, 1.0);
      vec4 bgColor2 = vec4(0.70, 0.95, 0.82, 1.0);
      vec4 bgColor3 = vec4(0.82, 1.00, 0.90, 1.0);

      for(int l = 0; l < linesPerGroup; l++) {
        float normalizedLineIndex = float(l) / float(linesPerGroup);

        float offsetTime = iTime * offsetSpeed;
        float offsetPosition = float(l) + space.x * offsetFrequency;

        float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;

        float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
        float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);

        float linePosition = getPlasmaY(space.x, horizontalFade, offset);
        float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

        float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
        vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
        float circle = drawCircle(circlePosition, 0.012, space) * 3.0;

        line = line + circle;
        lines += line * lineColor * rand;
      }

      vec4 fragColor = mix(bgColor1, bgColor2, uv.x);
      fragColor = mix(fragColor, bgColor3, uv.y * 0.35);

      fragColor *= 0.92 + verticalFade * 0.08;
      fragColor.a = 1.0;
      fragColor += lines * 0.55;

      gl_FragColor = fragColor;
    }
  `;

  function loadShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ) {
    const shader = gl.createShader(type);

    if (!shader) {
      return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  function initShaderProgram(
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string
  ) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const shaderProgram = gl.createProgram();

    if (!shaderProgram) {
      return null;
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        'Shader program link error:',
        gl.getProgramInfoLog(shaderProgram)
      );

      gl.deleteProgram(shaderProgram);
      return null;
    }

    return shaderProgram;
  }

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (!canvasElement) {
      return;
    }

    const gl = canvasElement.getContext('webgl', {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.warn('WebGL não é suportado neste navegador.');
      return;
    }

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    if (!shaderProgram) {
      return;
    }

    const positionBuffer = gl.createBuffer();

    if (!positionBuffer) {
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vertexPosition = gl.getAttribLocation(
      shaderProgram,
      'aVertexPosition'
    );

    const resolutionLocation = gl.getUniformLocation(
      shaderProgram,
      'iResolution'
    );

    const timeLocation = gl.getUniformLocation(shaderProgram, 'iTime');

    function resizeCanvas() {
      const rect = canvasElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvasElement.width = Math.max(1, Math.floor(rect.width * dpr));
      canvasElement.height = Math.max(1, Math.floor(rect.height * dpr));

      gl.viewport(0, 0, canvasElement.width, canvasElement.height);
    }

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    const startTime = Date.now();

    function render() {
      const currentTime = (Date.now() - startTime) / 1000;

      gl.clearColor(0.9, 1.0, 0.94, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(shaderProgram);

      gl.uniform2f(
        resolutionLocation,
        canvasElement.width,
        canvasElement.height
      );

      gl.uniform1f(timeLocation, currentTime);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(vertexPosition);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(render);
    }

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(shaderProgram);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
