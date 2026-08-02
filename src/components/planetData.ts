export interface MoonData {
  name: string;
  radius: number;
  distance: number;
  speed: number;
}

export interface RingData {
  innerRadius: number;
  outerRadius: number;
}

export interface PlanetData {
  name: string;
  radius: number;
  distance: number;
  speed: number; // orbital angular speed, radians/frame
  tilt: number; // axial tilt, radians
  atmosphereColor: string;
  moons: MoonData[];
  ring?: RingData;
}

export interface PlanetInfo {
  title: string;
  desc: string;
  numeral: string;
  distanceFromSun: string;
  moonCount: string;
  dayLength: string;
}

export const PLANET_TEXTURES: Record<string, string> = {
  Mercury: "/textures/2k_mercury.jpg",
  Venus: "/textures/2k_venus.jpg",
  Earth: "/textures/2k_earth_daymap.jpg",
  Mars: "/textures/2k_mars.jpg",
  Jupiter: "/textures/2k_jupiter.jpg",
  Saturn: "/textures/saturn.jpg",
  Uranus: "/textures/uranus.jpg",
  Neptune: "/textures/neptune.jpg",
};

export const PLANET_INFOS: Record<string, PlanetInfo> = {
  Mercury: {
    title: "Mercury",
    desc: "Mercury is the closest planet to the Sun and also the smallest in our solar system. It has no atmosphere to retain heat, causing extreme temperature differences between day and night — from over 400°C during the day to -180°C at night. A year on Mercury is just 88 Earth days long.",
    numeral: "I",
    distanceFromSun: "57.9M km",
    moonCount: "0 moons",
    dayLength: "59 days",
  },
  Venus: {
    title: "Venus",
    desc: "Venus is similar in size to Earth but wrapped in a thick, toxic atmosphere of carbon dioxide. Surface temperatures reach around 470°C, hotter than Mercury due to the greenhouse effect. Its clouds are made of sulfuric acid, and it spins in the opposite direction compared to most planets.",
    numeral: "II",
    distanceFromSun: "108.2M km",
    moonCount: "0 moons",
    dayLength: "243 days",
  },
  Earth: {
    title: "Earth",
    desc: "Earth is the only planet known to support life. It has a balanced climate, liquid water, and a protective atmosphere composed mainly of nitrogen and oxygen. Earth’s magnetic field shields us from harmful solar radiation, and its moon plays a key role in tides and planetary stability.",
    numeral: "III",
    distanceFromSun: "149.6M km",
    moonCount: "1 moon",
    dayLength: "24 hours",
  },
  Mars: {
    title: "Mars",
    desc: "Mars is a cold desert world known as the “Red Planet” due to its iron-rich soil. It has the tallest volcano in the solar system, Olympus Mons, and deep canyons like Valles Marineris. Scientists believe Mars once had water, and exploration continues for signs of ancient life.",
    numeral: "IV",
    distanceFromSun: "227.9M km",
    moonCount: "2 moons",
    dayLength: "24.6 hours",
  },
  Jupiter: {
    title: "Jupiter",
    desc: "Jupiter is the largest planet in our solar system — a massive gas giant with over 90 known moons. Its atmosphere is made mostly of hydrogen and helium. The Great Red Spot is a giant storm that has been raging for hundreds of years. Some of its moons, like Europa, may have subsurface oceans.",
    numeral: "V",
    distanceFromSun: "778.5M km",
    moonCount: "95 moons",
    dayLength: "9.9 hours",
  },
  Saturn: {
    title: "Saturn",
    desc: "Saturn is famous for its spectacular ring system made of ice and rock. It’s a gas giant like Jupiter, with over 140 moons, including Titan, which has a thick atmosphere. Saturn is less dense than water — if there were a big enough ocean, it could float!",
    numeral: "VI",
    distanceFromSun: "1.43B km",
    moonCount: "146 moons",
    dayLength: "10.7 hours",
  },
  Uranus: {
    title: "Uranus",
    desc: "Uranus is an ice giant with a pale blue color caused by methane in its upper atmosphere. It rotates on its side, making its seasons extreme and unusual. Temperatures on Uranus can drop to -224°C — making it one of the coldest places in the solar system.",
    numeral: "VII",
    distanceFromSun: "2.87B km",
    moonCount: "28 moons",
    dayLength: "17.2 hours",
  },
  Neptune: {
    title: "Neptune",
    desc: "Neptune is the farthest planet from the Sun. It has a deep blue color and is known for its fierce winds — the fastest recorded in the solar system, reaching up to 2,100 km/h. Neptune has 14 known moons and faint rings, and its largest moon, Triton, orbits in the opposite direction.",
    numeral: "VIII",
    distanceFromSun: "4.5B km",
    moonCount: "16 moons",
    dayLength: "16.1 hours",
  },
};

export const PLANETS: PlanetData[] = [
  { name: "Mercury", radius: 0.35, distance: 12, speed: 0.006, tilt: 0.001, atmosphereColor: "#9c9488", moons: [] },
  { name: "Venus", radius: 0.85, distance: 17, speed: 0.004, tilt: 3.096, atmosphereColor: "#e8c88a", moons: [] },
  {
    name: "Earth",
    radius: 0.9,
    distance: 22,
    speed: 0.002,
    tilt: 0.409,
    atmosphereColor: "#6ab7ff",
    moons: [{ name: "Moon", radius: 0.24, distance: 2.2, speed: 0.009 }],
  },
  {
    name: "Mars",
    radius: 0.5,
    distance: 28,
    speed: 0.0009,
    tilt: 0.44,
    atmosphereColor: "#d98a6a",
    moons: [
      { name: "Phobos", radius: 0.09, distance: 1.2, speed: 0.012 },
      { name: "Deimos", radius: 0.07, distance: 1.8, speed: 0.008 },
    ],
  },
  { name: "Jupiter", radius: 2.4, distance: 38, speed: 0.0007, tilt: 0.055, atmosphereColor: "#d8b28a", moons: [] },
  {
    name: "Saturn",
    radius: 2.0,
    distance: 47,
    speed: 0.0005,
    tilt: 0.466,
    atmosphereColor: "#e8d5a8",
    moons: [],
    ring: { innerRadius: 2.5, outerRadius: 4.4 },
  },
  {
    name: "Uranus",
    radius: 1.2,
    distance: 57,
    speed: 0.0002,
    tilt: 1.706,
    atmosphereColor: "#a8e4ff",
    moons: [],
    ring: { innerRadius: 1.6, outerRadius: 2.3 },
  },
  { name: "Neptune", radius: 1.15, distance: 65, speed: 0.00008, tilt: 0.494, atmosphereColor: "#7aa8ff", moons: [] },
];
