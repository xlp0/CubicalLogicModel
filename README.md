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
│   ├── CardContent/           # Dynamically loadable cube face components
│   │   ├── AbstractSpec.tsx   # Front face: Abstract specification view
│   │   ├── Clock.tsx         # Back face: Real-time clock display
│   │   ├── ConcreteImpl.tsx  # Right face: Implementation details
│   │   ├── Counter.tsx       # Left face: Interactive counter
│   │   ├── Notes.tsx         # Bottom face: Documentation view
│   │   ├── README.md         # Component guidelines and documentation
│   │   └── ...              # Other card components
│   │
│   └── WebPageCube/          # Core cube implementation
│       ├── WebPageCube.tsx   # Main cube component and 3D logic
│       ├── CubeControls.tsx  # UI controls for cube interaction
│       ├── HCard.tsx         # Dynamic component loader
│       └── ...              # Other cube-related components
│
├── pages/                    # Astro pages
│   └── index.astro          # Main entry point
│
└── ...                      # Other project files
```

### Architectural Changes

#### Component Organization

We've made significant improvements to the project architecture by reorganizing the component structure:

1. **Separation of Card Content**
   - Moved from `WebPageCube/LocalContent` to root-level `components/CardContent`
   - Better reflects the components' independent, reusable nature
   - Makes components more discoverable and maintainable

2. **HCard Evolution**
   - Changed from a local component loader to a global dynamic content system
   - Now accepts path-based imports for maximum flexibility
   - Allows for easier addition of new card components without modifying HCard

3. **Why We Eliminated LocalContent**
   - **Improved Modularity**: Components are no longer tightly coupled to WebPageCube
   - **Better Scalability**: Easier to add new components without cluttering the cube implementation
   - **Enhanced Reusability**: Components can be used in other parts of the application
   - **Clearer Dependencies**: Direct import paths make dependencies explicit
   - **Simplified Development**: Clear separation between cube logic and content

4. **Benefits of New Structure**
   - **Cleaner Organization**: Clear separation between infrastructure and content
   - **Better Developer Experience**: Easier to find and modify components
   - **Improved Maintainability**: Each component can evolve independently
   - **Future-Proof**: Ready for additional features and components

### Component Guidelines

Each cube face component should:
1. Be self-contained and independently loadable
2. Follow the 400x400px dimension standard (scaled down by 0.5 in the cube)
3. Handle its own state and side effects
4. Consider performance impact on cube rotation
5. Implement proper loading and error states

### Performance Considerations

The new architecture improves performance through:
1. Dynamic imports for code splitting
2. Memoization of component instances
3. Isolated re-renders
4. Optimized state management

### Future Extensibility

This structure supports future enhancements such as:
1. Additional cube face components
2. Alternative card layouts
3. Dynamic component marketplace
4. Shared component state management
5. Custom theming and styling systems

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
