declare global {
    interface Window {
      t(key: string): string | null;
      fromRoute?: string;

    }
    interface GlobalThis {
      app: AppNamespace;
    }
     namespace JSX {
        interface IntrinsicElements {
        'ion-card': any;
        'ion-card-header': any;
        'ion-card-title': any;
        'ion-card-content': any;
        'ion-button': any;
        'ion-card-subtitle': any;
        'ion-icon': any;
        'ion-item': any;
        'ion-label': any;
        'ion-list': any;
        'ion-text': any;
        // add more Ionic elements as you need
      }
      }
    const app: AppNamespace;
  }

  
  
  export {};
  