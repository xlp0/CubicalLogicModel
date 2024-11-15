"use client";

interface CubeFaceProps {
  position: [number, number, number];
  rotation: [number, number, number];
  children: React.ReactNode;
}

export default function CubeFace({ position, rotation, children }: CubeFaceProps) {
  return (
    <div
      className="absolute w-[400px] h-[400px] bg-white shadow-2xl"
      style={{
        transform: `translate3d(${position[0] - 200}px, ${position[1] - 200}px, ${position[2] - 200}px) 
                   rotateX(${rotation[0]}deg) rotateY(${rotation[1]}deg) rotateZ(${rotation[2]}deg)
                   `,
      }}
    >
      {children}
    </div>
  );
}