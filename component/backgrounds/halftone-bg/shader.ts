export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const TRAIL_LENGTH = 12;

export const fragmentShader = /* glsl */ `
  uniform vec2 uResolution;
  uniform float uGridSize;
  uniform float uRadius;
  uniform vec3 uBgColor;
  uniform vec3 uDotColor;
  uniform vec2 uTrail[${TRAIL_LENGTH}];
  uniform float uHover;

  varying vec2 vUv;

  const int TRAIL_LENGTH = ${TRAIL_LENGTH};

  void main() {
    float aspect = uResolution.x / uResolution.y;

    vec2 uv = vUv;
    uv.x *= aspect;

    vec2 gridUv = uv * uGridSize;
    vec2 cellUv = fract(gridUv) - 0.5;
    vec2 cellId = floor(gridUv);

    vec2 cellCenter = (cellId + 0.5) / uGridSize;
    cellCenter.x /= aspect;

    vec2 aCellCenter = vec2(cellCenter.x * aspect, cellCenter.y);

    float trailBoost = 0.0;
    for (int i = 0; i < TRAIL_LENGTH; i++) {
      vec2 aTrailPoint = vec2(uTrail[i].x * aspect, uTrail[i].y);
      float d = distance(aCellCenter, aTrailPoint);

      float ageFade = 1.0 - (float(i) / float(TRAIL_LENGTH));

      // ============================================================
      // TRAIL_INFLUENCE_RADIUS controls how big the "hit zone" is
      // around each trail point — this is the radius you want to tune.
      // Bigger number = fatter, more overlapping streak.
      // Smaller number = tighter, more pinpoint dots following the cursor.
      // ============================================================
      const float TRAIL_INFLUENCE_RADIUS = 0.16;

      float hit = smoothstep(TRAIL_INFLUENCE_RADIUS, 0.0, d) * ageFade;
      trailBoost = max(trailBoost, hit);
    }
    trailBoost *= uHover;

    float dist = length(cellUv);
    float radius = uRadius + trailBoost * 0.3;

    float aa = fwidth(dist);
    float circle = smoothstep(radius - aa, radius + aa, dist);

    vec3 color = mix(uDotColor, uBgColor, circle);
    gl_FragColor = vec4(color, 1.0);
  }
`;
