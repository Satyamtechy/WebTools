import { Injectable } from '@angular/core';
import * as prettier from 'prettier/standalone';

@Injectable({
  providedIn: 'root'
})
export class PrettierService {

  constructor() { }

  async formatCode(inputCode: string): Promise<string> {
    try {
      const formattedCode = await prettier.format(inputCode, {
        parser: 'typescript'
      });

      return formattedCode;
    } catch (error) {
      console.error('Error formatting code:', error);
      throw new Error('Error formatting code');
    }
  }
}
