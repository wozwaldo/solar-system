export const vertexShader = `
varying vec3 vWorldPosition;

void main() {
    vWorldPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform float iTime;
varying vec3 vWorldPosition;

// Random function from original shader
float hash(vec3 p) {
    p = fract(p * vec3(.1031, .11369, .13787));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
}

// Star layer function from original shader
// hash threshold controls density: 0.99 keeps roughly half the stars vs 0.98
float calcStarLayer(vec3 d, float intensity) {
    return smoothstep(intensity, 0., length(fract(d) - 0.5)) * smoothstep(0.993, 1., hash(floor(d)));
}

// Noise function for nebula
float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float n = i.x + i.y * 157.0 + 113.0 * i.z;
    return mix(
        mix(
            mix(hash(vec3(n + 0.0)), hash(vec3(n + 1.0)), f.x),
            mix(hash(vec3(n + 157.0)), hash(vec3(n + 158.0)), f.x),
            f.y
        ),
        mix(
            mix(hash(vec3(n + 113.0)), hash(vec3(n + 114.0)), f.x),
            mix(hash(vec3(n + 270.0)), hash(vec3(n + 271.0)), f.x),
            f.y
        ),
        f.z
    );
}

// FBM (Fractal Brownian Motion) for nebula
float fbm(vec3 p) {
    float f = 0.0;
    float a = 0.5;
    for(int i = 0; i < 5; i++) {
        f += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return f;
}

void main() {
    vec3 pos = normalize(vWorldPosition);
    vec3 rayDir = pos;

    // deep violet-black base (matches --void #0D0B12)
    vec3 bgColor = vec3(0.051, 0.043, 0.071) * 0.09;

    // star layers, pearl-tinted, gentle twinkle
    vec3 pearl = vec3(0.937, 0.918, 0.961);
    vec3 starColor = vec3(0.0);
    starColor += calcStarLayer(rayDir * 620., 0.35) * pearl * 0.4;              // fine far layer
    starColor += calcStarLayer(rayDir * 340., 0.30) * pearl * 0.55;             // mid layer
    starColor += calcStarLayer(rayDir * 180., 0.22 + 0.05 * sin(iTime * 0.8)) * pearl * 0.7; // near, brightest
    // subtle chromatic accents on a sparse layer
    starColor += calcStarLayer(rayDir * 260., 0.28) * vec3(0.78, 0.72, 1.0) * 0.22; // lilac
    starColor += calcStarLayer(rayDir * 300., 0.28) * vec3(0.66, 0.89, 1.0) * 0.16; // ice

    // milky way band: brightness concentrated near an inclined great circle
    vec3 bandNormal = normalize(vec3(0.35, 1.0, 0.15));
    float band = 1.0 - abs(dot(pos, bandNormal));
    float bandMask = smoothstep(0.75, 1.0, band);
    float bandNoise = fbm(pos * 6.0);
    vec3 milkyWay = pearl * bandMask * bandNoise * 0.014
                  + vec3(0.78, 0.72, 1.0) * bandMask * fbm(pos * 3.0) * 0.008;

    // aurora veils: slow-drifting fbm in palette colors, very low intensity
    vec3 ap = pos * 2.0 + vec3(iTime * 0.004, 0.0, iTime * 0.002);
    vec3 aurora = vec3(0.0);
    aurora += vec3(0.78, 0.72, 1.0) * smoothstep(0.55, 0.85, fbm(ap * 1.3));         // lilac
    aurora += vec3(1.0, 0.72, 0.82) * smoothstep(0.60, 0.90, fbm(ap * 1.7 + 4.2));   // rose
    aurora += vec3(0.66, 0.89, 1.0) * smoothstep(0.55, 0.85, fbm(ap * 1.1 + 9.1));   // ice
    aurora *= 0.008;

    // occasional slow shooting star: one streak sweeping a band every ~14s
    float cycle = fract(iTime / 14.0);
    float streakPos = mix(-1.2, 1.2, cycle);
    vec3 streakDir = normalize(vec3(1.0, 0.35, 0.2));
    float along = dot(pos, streakDir);
    float across = length(pos - streakDir * along);
    float streak = smoothstep(0.012, 0.0, abs(along - streakPos) - 0.04)
                 * smoothstep(0.03, 0.0, across - 0.001)
                 * smoothstep(0.0, 0.1, cycle) * smoothstep(1.0, 0.9, cycle);
    vec3 shooting = pearl * streak * 0.6;

    gl_FragColor = vec4(bgColor + starColor + milkyWay + aurora + shooting, 1.0);
}
`;