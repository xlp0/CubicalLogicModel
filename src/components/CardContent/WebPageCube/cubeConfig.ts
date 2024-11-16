export interface CubeFaceConfig {
  componentName: string;
  title: string;
  description: string;
}

export interface CubeConfig {
  front: CubeFaceConfig;
  back: CubeFaceConfig;
  left: CubeFaceConfig;
  right: CubeFaceConfig;
  top: CubeFaceConfig;
  bottom: CubeFaceConfig;
}

const cubeConfig: CubeConfig = {
  front: {
    componentName: 'AbstractSpec',
    title: 'Abstract Specification',
    description: 'High-level system design and requirements'
  },
  back: {
    componentName: 'AbstractSpec',
    title: 'Abstract View',
    description: 'Alternative abstract perspective'
  },
  left: {
    componentName: 'ConcreteImpl',
    title: 'Concrete Implementation',
    description: 'Actual system implementation details'
  },
  right: {
    componentName: 'ConcreteImpl',
    title: 'Implementation View',
    description: 'Technical implementation aspects'
  },
  top: {
    componentName: 'RealisticExpectations',
    title: 'Realistic Expectations',
    description: 'Project constraints and limitations'
  },
  bottom: {
    componentName: 'RealisticExpectations',
    title: 'Practical Considerations',
    description: 'Real-world implementation factors'
  }
};

export default cubeConfig;
