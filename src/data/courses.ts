import { readSvgFile } from '../utils/svg';

export interface Course {
  title: string;
  description: string;
  icon: string;
  link: string;
  featured?: boolean;
  coming?: boolean;
}

export async function getCourses(): Promise<Course[]> {
  return [
    {
      title: "Cubical Logic Model",
      description: "Explore logical concepts through an interactive 3D interface inspired by Leibniz's Monadology.",
      icon: await readSvgFile('cubical-logic.svg'),
      link: "/cubical-model",
      featured: true
    },
    {
      title: "Introduction to Logic",
      description: "Learn the fundamentals of logical reasoning and argumentation.",
      icon: await readSvgFile('intro-logic.svg'),
      link: "#",
      coming: true
    },
    {
      title: "Advanced Topics",
      description: "Dive deep into advanced logical concepts and their applications.",
      icon: await readSvgFile('advanced-topics.svg'),
      link: "#",
      coming: true
    }
  ];
}
