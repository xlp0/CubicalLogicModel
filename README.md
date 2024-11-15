# Cubical Logic Model

An interactive 3D cube interface built with Astro and React, demonstrating the relationship between abstract specifications and concrete implementations in software development.

## 🚀 Features

- Interactive 3D cube visualization
- Real-time rotation controls
- Zoom and movement functionality
- Dynamic face content rendering
- Smooth animations and transitions
- High-contrast UI controls
- Responsive design

## 🛠️ Technology Stack

- **Framework:** [Astro](https://astro.build/) with React integration
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** 
  - Radix UI primitives
  - Lucide React icons
  - Custom React components

## 🏗️ Project Structure

```
src/
├── components/
│   ├── WebPageCube/
│   │   ├── CubeFace.tsx         # Generic cube face component
│   │   ├── CubeControls.tsx     # Rotation and movement controls
│   │   ├── WebPageCube.tsx      # Main cube container
│   │   └── LocalContent/        # Face-specific content
│   └── ui/                      # Reusable UI components
├── layouts/
│   └── Layout.astro            # Main layout template
└── pages/
    └── index.astro             # Homepage
```

## 🎮 Controls

- **Rotation:** Toggle automatic rotation and adjust speed
- **Manual Control:** Click and drag to rotate the cube
- **Zoom:** Use zoom in/out buttons to adjust view
- **Reset:** Return to default position and rotation

## 🚦 Getting Started

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## 🎯 Core Concepts

The cube represents the relationship between:
- Abstract specifications (front/back faces)
- Concrete implementations (left/right faces)
- Realistic expectations (top/bottom faces)

Each face demonstrates different aspects of software development methodology through interactive content.

## 🧩 Components

### WebPageCube
The main container component managing the 3D transformation and state.

### CubeFace
A reusable component for rendering individual cube faces with proper positioning and rotation.

### CubeControls
User interface for manipulating the cube's position, rotation, and scale.

## 📦 Dependencies

- @astrojs/react
- @astrojs/tailwind
- @radix-ui/react-slider
- lucide-react
- tailwindcss
- typescript

## 🎨 Styling

The project uses Tailwind CSS with custom utilities for:
- 3D transformations
- Perspective handling
- Responsive design
- High-contrast UI elements

## 🔧 Configuration

- TypeScript configuration in `tsconfig.json`
- Astro configuration in `astro.config.mjs`
- Tailwind configuration in `tailwind.config.mjs`

## 📝 License

MIT License - feel free to use this project for learning and development purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
