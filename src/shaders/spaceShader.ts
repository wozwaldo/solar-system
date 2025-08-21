export const vertexShader = `
varying vec3 vWorldPosition;

void main() {
    vWorldPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
varying vec3 vWorldPosition;

const float PI = 3.141592;

// Random function from original shader
float hash(vec3 p) {
    p = fract(p * vec3(.1031, .11369, .13787));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
}

// Star layer function from original shader
float calcStarLayer(vec3 d, float intensity) {
    return smoothstep(intensity, 0., length(fract(d) - 0.5)) * smoothstep(0.98, 1., hash(floor(d)));
}

// Falling star function from original shader
float fallingStar(vec3 p, vec3 a, vec3 b) {
    p -= a;
    b -= a;
    float h = clamp(dot(p, b) / dot(b, b), 0., 1.);
    p -= b * h;
    return h * smoothstep(2. * h / iResolution.y, 0., length(p));
}

// Rotation matrix for falling stars
mat3 rotMat(float k) {
    float c = cos(k);
    float s = sin(k);
    return mat3(
        c, -s, 0,
        s, c, 0,
        0, 0, 1
    );
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
    // Get the direction from center
    vec3 pos = normalize(vWorldPosition);
    
    // Create a ray direction for star calculations
    vec3 rayDir = pos;
    
    // Base background color (same as original)
    vec3 bgColor = vec3(0.01, 0.01, 0.02);
    
    // Add falling stars (adapted for 3D)
    vec3 fallingStarDir = rayDir * rotMat(PI);
    vec3 fallingStarStart = vec3(-0.04, 0.0, 0.0) + vec3(tan(iTime / 4.), 0.0, 0.0);
    vec3 fallingStarEnd = vec3(0.04, 0.0, 0.0) + vec3(tan(iTime / 4.), 0.0, 0.0);
    vec3 fallingStarColor = fallingStar(fallingStarDir, fallingStarStart, fallingStarEnd) * vec3(0.3, 0.4, 0.7);
    
    // Add star layers (same as original)
    vec3 starColor = vec3(0.0);
    starColor += vec3(calcStarLayer(rayDir * 550., abs(sin(iTime / 2.)) / 2.)) * vec3(0.5, 0.28, 0.73);
    starColor += vec3(calcStarLayer(rayDir * 500., abs(cos(iTime / 2.)) / 2.)) * vec3(0.3, 0.6, 0.73);
    starColor += vec3(calcStarLayer(rayDir * 400., abs(cos(iTime)) / 2.)) * vec3(0.5, 0.58, 0.43);
    starColor += vec3(calcStarLayer(rayDir * 500., abs(sin(iTime)) / 2.)) * vec3(0.2, 0.2, 0.8);
    
    // Add the bright spot from original shader
    vec3 brightSpot = vec3(0.09 / length(pos - vec3(0, 0.07, 0))) * vec3(0.7, 0.5, 0.);
    
    // Add nebula effect
    vec3 nebulaPos = pos * 2.0 + vec3(iTime * 0.005); // Slow rotation
    float nebulaNoise = fbm(nebulaPos);
    
    // Create colorful nebula gradients with cool tones
    vec3 nebulaColor = vec3(0.0);
    nebulaColor += vec3(0.2, 0.3, 0.8) * smoothstep(0.3, 0.7, fbm(nebulaPos * 1.5)); // Deep blue
    nebulaColor += vec3(0.4, 0.2, 0.9) * smoothstep(0.4, 0.6, fbm(nebulaPos * 2.0)); // Purple
    nebulaColor += vec3(0.3, 0.5, 0.9) * smoothstep(0.2, 0.8, fbm(nebulaPos * 1.0)); // Light blue
    nebulaColor += vec3(0.2, 0.8, 0.3) * smoothstep(0.5, 0.9, fbm(nebulaPos * 1.7)); // Green
    
    // Blend nebula with base color (reduced opacity)
    float nebulaIntensity = smoothstep(0.2, 0.8, nebulaNoise) * 0.05; // Reduced from 0.3 to 0.15
    vec3 finalNebula = nebulaColor * nebulaIntensity;
    
    // Combine everything
    vec3 finalColor = bgColor + fallingStarColor + starColor + brightSpot + finalNebula;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`; 