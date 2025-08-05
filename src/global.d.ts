declare global {
    interface Window {
      t(key: string): string | null;

    }
    interface GlobalThis {
      app: AppNamespace;
    }
  
    const app: AppNamespace;
  }

  
  
  export {};
  