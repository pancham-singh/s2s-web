declare module '*.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export default value;
}
