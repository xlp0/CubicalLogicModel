# CubicalLogicModel

A dynamic, interactive 3D web application built with Astro, React, and Three.js, featuring a responsive split-panel layout and dynamic component loading.

## 🚀 Features

- Interactive 3D cube interface with dynamic face content
- Responsive split-panel layout
- Dynamic component loading system
- Rich set of interactive components
- Real-time 3D controls and animations
- Modern, clean UI with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **UI Library**: [React](https://reactjs.org/)
- **3D Graphics**: [Three.js](https://threejs.org/) with [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Layout**: [react-split](https://www.npmjs.com/package/react-split)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📁 Project Structure

```
src/
├── components/
│   ├── CardContent/           # Content components for cube faces
│   │   ├── WebPageCube/      # 3D cube implementation
│   │   │   ├── WebPageCube.tsx
│   │   │   ├── CubeFace.tsx
│   │   │   ├── CubeControls.tsx
│   │   │   └── cubeConfig.ts
│   │   ├── AbstractSpec.tsx
│   │   ├── ConcreteImpl.tsx
│   │   ├── RealisticExpectations.tsx
│   │   ├── ThreeJsCube.tsx
│   │   ├── SpotifyPlayer.tsx
│   │   ├── YouTubePlayer.tsx
│   │   └── ... (other content components)
│   ├── SplitLayout/          # Layout components
│   │   ├── SplitPane.tsx
│   │   ├── SplitLayout.tsx
│   │   └── LeftPanel.tsx
│   ├── ui/                   # UI components
│   │   ├── button.tsx
│   │   ├── slider.tsx
│   │   └── ... (other UI components)
│   └── HCard.tsx             # Dynamic component loader
├── layouts/
│   └── Layout.astro          # Main layout template
├── lib/
│   └── utils.ts              # Utility functions
└── pages/
    └── index.astro           # Main entry point
```

## 🔑 Key Components

### HCard
Dynamic component loader that handles lazy loading and error management for components.

### WebPageCube
Interactive 3D cube interface with configurable faces and controls.

### SplitPane
Responsive split-panel layout manager with resizable panels.

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Build**
   ```bash
   npm run build
   ```

## 🎮 Usage

The application provides an interactive 3D cube interface with:
- Drag controls for rotation
- Zoom controls
- Auto-rotation toggle
- Dynamic content loading for each face
- Resizable split panels

## 🧩 Component System

### Dynamic Loading
Components are loaded dynamically using the `HCard` component:
```tsx
<HCard
  importPath="WebPageCube/WebPageCube"
  componentProps={{
    title: "Interactive Web Cube",
    frontComponent: "AbstractSpec",
    backComponent: "RealisticExpectations",
    // ... other face components
  }}
/>
```

### Cube Face Configuration
Each cube face can be configured with different components:
- Front: Abstract Specifications
- Back: Realistic Expectations
- Right: Concrete Implementation
- Left: Spotify Player
- Top: YouTube Player
- Bottom: Interactive Counter

## 🛡️ Error Handling

The system includes comprehensive error handling:
- Dynamic import error catching
- Component loading fallbacks
- Detailed error messages
- Debug logging system

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Consistent design system
- Responsive layouts
- Modern UI components

## 🔧 Development

### Adding New Components
1. Create component in `src/components/CardContent`
2. Register in WebPageCube configuration
3. Import dynamically using HCard

### Modifying Cube Behavior
Adjust cube parameters in `cubeConfig.ts`:
- Rotation speed
- Control sensitivity
- Animation parameters

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
