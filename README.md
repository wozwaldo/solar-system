# 🌌 Interactive Solar System

A 3D interactive solar system built with React, Three.js, and React Three Fiber. Explore the planets, learn about our solar system, and enjoy a fun space experience.

## ✨ Features

- **Interactive 3D Solar System**: Navigate through space with realistic planet orbits
- **Planet Information Cards**: Click on planets to learn fascinating facts
- **Realistic Textures**: High-quality 2K/8K textures for planets and space shader
- **Dynamic Background**: Beautiful animated nebula and starfield shader
- **Audio Experience**: Ambient space music with interactive sound effects
- **Smooth Camera Controls**: Orbit controls for immersive exploration

## 🚀 Live Demo

[View Live Demo on Vercel](https://solar-system-b.vercel.app/)

## 🛠 Technologies Used

- **React 19** - React with concurrent features
- **TypeScript** - Type-safe development
- **Three.js** - 3D graphics and WebGL
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Custom GLSL Shaders** - Custom space background with nebula effects
- **CSS Modules** - Scoped styling

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/solar-system.git
cd solar-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎮 Usage

- **Mouse Controls**: 
  - Left click + drag to rotate the view
  - Scroll wheel to zoom in/out
  - Right click + drag to pan

- **Planet Interaction**:
  - Click on any planet to view detailed information
  - Close the info card to return to solar system view
  - The camera will smoothly focus on the selected planet

- **Audio Controls**:
  - Toggle sound on/off with the speaker icon
  - Enjoy ambient space music and interaction sounds

### Included Celestial Bodies

- **Sun** 
- **Mercury** 
- **Venus** 
- **Earth** 
- **Mars**
- **Jupiter** 
- **Saturn** 
- **Uranus** 
- **Neptune** 

## 🎨 Customization

### Adding New Planets or Moons

Edit the `planets` array in `SolarSystem.tsx`:

```typescript
const planets = [
  {
    name: "NewPlanet",
    radius: 1.0,
    distance: 50,
    speed: 0.001,
    moons: [
      { name: "NewMoon", radius: 0.2, distance: 2, speed: 0.01 }
    ]
  }
];
```

### Modifying Shaders

Edit `src/shaders/spaceShader.ts` to customize the space background:

- Modify `vertexShader` for geometry transformations
- Edit `fragmentShader` for visual effects (stars, nebula, colors)

### Planet Information

Update planet data in the `PLANET_INFOS` object in `SolarSystem.tsx`.

**Made with ❤️ and lots of ☕ for space exploration enthusiasts**
