# Cubical Logic Model

An interactive 3D cube interface for presenting information about the Cubical Logic Model. This project is built with Next.js, React Three Fiber, and TypeScript, featuring multiple interactive faces with different functionalities.

## 🚀 Features

- Interactive 3D cube with smooth rotation and manipulation
- Multiple functional faces including:
  - Clock
  - Calculator
  - Color Picker
  - Notes
  - Abstract Specifications
  - Concrete Implementations
  - Realistic Expectations
- Responsive design with touch and mouse controls
- Real-time cube manipulation (rotation, scaling, positioning)
- Modern UI components using Radix UI
- Fully typed with TypeScript

## 🛠️ Tech Stack

- **Framework**: Next.js 13+
- **Language**: TypeScript
- **3D Rendering**: React Three Fiber
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Animation**: RequestAnimationFrame API

## 🏗️ Project Structure

```
/app
  /components
    /WebPageCube          # Main cube component
      /LocalContent       # Individual face components
      CubeControls.tsx    # Cube manipulation controls
      CubeFace.tsx        # Generic face component
      WebPageCube.tsx     # Main cube implementation
```

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 Usage

- **Rotation**: Click and drag the cube to rotate it manually
- **Auto-rotation**: Toggle automatic rotation using controls
- **Scaling**: Zoom in/out using the scale controls
- **Position**: Adjust the cube's position in 3D space
- **Face Interaction**: Click on any face to interact with its specific functionality

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is MIT licensed.
