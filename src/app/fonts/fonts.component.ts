import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-fonts',
  standalone: true,
  imports: [CommonModule,FormsModule,ColorPickerModule],
  templateUrl: './fonts.component.html',
  styleUrl: './fonts.component.scss'
})
export class FontsComponent implements OnInit{

  show: boolean=true;
  svg: boolean = false;
  jsx: boolean = false;
  strokeWidth: number = 2;
  strokeSize:number = 24;
  color: string = '#000000';

  ngOnInit(): void {

  }

  showSubMenu(type:string){
    if(type == 'SVG'){
      this.svg = !this.svg;
    }
    if(type == 'JSX'){
      this.jsx = !this.jsx;
    }
  }
  resetStroke(){
    this.strokeWidth = 2;
    this.strokeSize = 24;
    this.color = '#000000'
  }
  onColorChange(color: string): void {
    this.color = color;
  }
}
