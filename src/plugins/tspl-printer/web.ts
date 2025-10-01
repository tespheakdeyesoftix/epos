import { WebPlugin } from '@capacitor/core';
import type { TsplPrinterPlugin } from './definitions';

export class TsplPrinterWeb extends WebPlugin implements TsplPrinterPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    // .log('ECHO', options);
    return options;
  }

  async printTsplCommand(options: { command: string }): Promise<{ success: boolean }> {
    // .log('TSPL Command (web dummy implementation):', options.command);
    return { success: true };
  }
}