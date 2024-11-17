import { readSvgFile } from '../utils/svg';

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export async function getFeatures(): Promise<Feature[]> {
  return [
    {
      title: "Interactive 3D Learning",
      description: "Explore complex concepts through an interactive 3D cube interface that brings abstract ideas to life.",
      icon: await readSvgFile('3d-cube.svg')
    },
    {
      title: "Dynamic Content Loading",
      description: "Experience seamless content transitions with our Monad-inspired component architecture.",
      icon: await readSvgFile('dynamic-loading.svg')
    },
    {
      title: "Split-View Interface",
      description: "Customize your learning environment with resizable panels for optimal content organization.",
      icon: await readSvgFile('split-view.svg')
    }
  ];
}
