// NOTE 
// we use this because in the furture we may check plateform specific like ios or android, 
export  function setItem(key:string,value:any) {
    localStorage.setItem(key,value)
}

export  function getItem(key:string) {
    return localStorage.getItem(key)
}


export const storageService = {
    setItem(key: string, value: any): void {
      localStorage.setItem(key, value);
    },
    getItem(key: string): string | null {
      
      return localStorage.getItem(key);
    },
    removeItem(key: string, value: any): void {
      localStorage.removeItem(key);
    },
  };

  