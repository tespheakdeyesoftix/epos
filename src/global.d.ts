declare global {
    interface Window {
      storageService: {
        setItem(key: string, value: any): void;
        removeItem(key: string, value: any): void;
        getItem(key: string): string | null;
      },
      t(key: string): string | null;
      showWarning(message: string): void;
      showSuccess(message: string): void;
      showError(message: string): void;
      showLoading(message: string): void;
      openModal(props:object): void;
    }
  }
  
  export {};
  