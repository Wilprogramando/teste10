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
    glContext: WebGLRenderingContext,
    type: number,
    source: string
  ) {
    const shader = glContext.createShader(type);

    if (!shader) {
      return null;
    }

    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);

    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
      console.error('Shader compile error:', glContext.getShaderInfoLog(shader));
      glContext.deleteShader(shader);
      return null;
    }

    return shader;
  }

  function initShaderProgram(
    glContext: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string
  ) {
    const vertexShader = loadShader(
      glContext,
      glContext.VERTEX_SHADER,
      vertexSource
    );

    const fragmentShader = loadShader(
      glContext,
      glContext.FRAGMENT_SHADER,
      fragmentSource
    );

    if (!vertexShader || !fragmentShader) {
      return null;
    }

    const shaderProgram = glContext.createProgram();

    if (!shaderProgram) {
      return null;
    }

    glContext.attachShader(shaderProgram, vertexShader);
    glContext.attachShader(shaderProgram, fragmentShader);
    glContext.linkProgram(shaderProgram);

    if (!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS)) {
      console.error(
        'Shader program link error:',
        glContext.getProgramInfoLog(shaderProgram)
      );

      glContext.deleteProgram(shaderProgram);
      return null;
    }

    return shaderProgram;
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
    });

    if (!context) {
      console.warn('WebGL não é suportado neste navegador.');
      return;
    }

    const glContext: WebGLRenderingContext = context;

    const shaderProgram = initShaderProgram(glContext, vsSource, fsSource);

    if (!shaderProgram) {
      return;
    }

    const positionBuffer = glContext.createBuffer();

    if (!positionBuffer) {
      return;
    }

    glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);

    const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];

    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      new Float32Array(positions),
      glContext.STATIC_DRAW
    );

    const vertexPosition = glContext.getAttribLocation(
      shaderProgram,
      'aVertexPosition'
    );

    const resolutionLocation = glContext.getUniformLocation(
      shaderProgram,
      'iResolution'
    );

    const timeLocation = glContext.getUniformLocation(shaderProgram, 'iTime');

    function resizeCanvas() {
      const currentCanvas = canvasRef.current;

      if (!currentCanvas) {
        return;
      }

      const rect = currentCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      currentCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
      currentCanvas.height = Math.max(1, Math.floor(rect.height * dpr));

      glContext.viewport(0, 0, currentCanvas.width, currentCanvas.height);
    }

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    const startTime = Date.now();

    function render() {
      const currentCanvas = canvasRef.current;

      if (!currentCanvas) {
        return;
      }

      const currentTime = (Date.now() - startTime) / 1000;

      glContext.clearColor(0.9, 1.0, 0.94, 1.0);
      glContext.clear(glContext.COLOR_BUFFER_BIT);

      glContext.useProgram(shaderProgram);

      glContext.uniform2f(
        resolutionLocation,
        currentCanvas.width,
        currentCanvas.height
      );

      glContext.uniform1f(timeLocation, currentTime);

      glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
      glContext.vertexAttribPointer(vertexPosition, 2, glContext.FLOAT, false, 0, 0);
      glContext.enableVertexAttribArray(vertexPosition);

      glContext.drawArrays(glContext.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(render);
    }

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      glContext.deleteBuffer(positionBuffer);
      glContext.deleteProgram(shaderProgram);
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
