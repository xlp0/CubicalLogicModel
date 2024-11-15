# Card Content Components

This directory contains React components that can be dynamically loaded into the 3D cube faces using the `HCard` component. Each component in this directory should be designed to work within the cube face dimensions and follow the established patterns.

## Current Components

- `AbstractSpec.tsx` - Abstract specification component (Front face)
- `Clock.tsx` - Real-time clock display (Back face)
- `ConcreteImpl.tsx` - Concrete implementation component (Right face)
- `Counter.tsx` - Interactive counter component (Left face)
- `RealisticExpectations.tsx` - Expectations visualization (Top face)
- `Notes.tsx` - Notes and documentation component (Bottom face)

## Creating New Components

To create a new component for the cube faces:

1. Create a new `.tsx` file in this directory
2. Export a React component as default
3. Design your component to work within these constraints:
   - Container dimensions: 400x400px (will be scaled down by 0.5)
   - Use relative units when possible
   - Handle both light and dark themes appropriately
   - Consider the 3D perspective when designing the UI

### Example Component Template

```tsx
import React from 'react';

const YourComponent: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
      {/* Your content here */}
    </div>
  );
};

export default YourComponent;
```

## Usage

To use a component in the cube:

```tsx
<HCard importPath="../CardContent/YourComponent" />
```

## Best Practices

1. **Performance**
   - Use React.memo for static content
   - Optimize animations and state updates
   - Consider the impact on cube rotation performance

2. **Styling**
   - Use Tailwind CSS for consistent styling
   - Follow the established color scheme
   - Ensure good contrast for readability from any angle

3. **Interactivity**
   - Handle mouse events appropriately
   - Consider the 3D context when designing interactions
   - Provide visual feedback for interactive elements

4. **Accessibility**
   - Include proper ARIA labels
   - Ensure keyboard navigation works
   - Maintain sufficient color contrast

## Development Guidelines

- Test components in isolation before adding to the cube
- Ensure smooth loading transitions
- Keep components modular and self-contained
- Document any special requirements or dependencies
- Consider the component's impact on the overall cube performance
