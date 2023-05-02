export interface NavigationNode {
  name: string,
  path?: string,
  children?: NavigationNode[];
}

const NAVIGATION_TREE: NavigationNode[] = [
  {
    name: "Form control schema", children: [
      { name: "Using form control schema", path: '/examples/form-control-schema' }
    ]
  },
  {
    name: "Form group schema", children: [
      { name: "Using form group schema", path: '/examples/form-group-schema' }
    ]
  }
];

Object.freeze(NAVIGATION_TREE);

export { NAVIGATION_TREE };
