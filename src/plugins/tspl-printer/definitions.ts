import type { PluginListenerHandle } from '@capacitor/core';

export interface TsplPrinterPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;

  printTsplCommand(options: { command: string }): Promise<{ success: boolean }>;
  
}