import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrettierService } from './services/prettier.service';

@Component({
  selector: 'app-code-formatter',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './code-formatter.component.html',
  styleUrl: './code-formatter.component.scss'
})
export class CodeFormatterComponent implements OnInit{
  lines: number[] = [];
  content: string = '';
  check:boolean=false;
  maxChar:number=10;
  formattedCode: string = '';

  constructor(@Inject(PrettierService)private prettyService:any){}
  ngOnInit(): void {
  }


  // updateLineNumber() {
  //   if (this.content !== null && this.content !== undefined) {
  //     if (this.content.length >= this.maxChar) {
  //       this.content += '\n';
  //       this.check = true;
  //       this.maxChar = this.check ? this.maxChar + 11 : this.maxChar; 
  //     }
  //     console.log('length', this.content.length, 'max', this.maxChar, 'check', this.check);
  //     if (this.check) {
  //       this.check = false;
  //     }
  //     const matches = this.content.match(/[^\n]*\n?/g);
  //     this.lines = matches ? matches.map((_, index) => index + 1) : [];
  //   } else {
  //     this.lines = [1];
  //   }
  // }
  
  // onPaste(event: ClipboardEvent): void {
  //   const pastedText = event.clipboardData?.getData('text') || '';
  //   this.content += pastedText;
  //   this.addNewlines();
  // }
  
  // addNewlines(): void {
  //   const newMaxChar = Math.floor(this.content.length / 10) * 10 + 11;
  
  //   if (newMaxChar !== this.maxChar) {
  //     this.content += '\n';
  //     this.maxChar = newMaxChar;
  //   }
  
  //   console.log('length', this.content.length, 'max', this.maxChar);
  
  //   const matches = this.content.split('\n');
  //   this.lines = matches ? matches.map((_, index) => index + 1) : [];
  // }
  
}

