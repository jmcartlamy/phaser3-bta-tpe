declare module '*.png' {
  const content: string;
  export default content;
}

declare var process: {
  env: {
    EXT_CLIENT_ID: string;
    EXT_CLIENT_SECRET: string;
    NODE_ENV: 'development' | 'production';
  };
};
