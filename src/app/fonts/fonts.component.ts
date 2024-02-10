import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { FontsService } from './services/fonts.service';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FilterPipe } from '../shared/Pipes/filter-pipe.pipe';

@Component({
    selector: 'app-fonts',
    standalone: true,
    templateUrl: './fonts.component.html',
    styleUrl: './fonts.component.scss',
    imports: [CommonModule, FormsModule, ColorPickerModule, HttpClientModule, ClipboardModule, MatTooltipModule, FilterPipe]
})
export class FontsComponent implements OnInit{
  show: boolean=false;
  strokeWidth: number = 2;
  strokeSize:number = 24;
  color: string = '#000000';
  svg: boolean = false;
  jsx: boolean = false;
  allIcons:any = [];
  svgContent: string = '';
  svgContentSafe!:SafeHtml;
  svgDetails: any;
  svgCopy: string='';
  categories: string[]=[];
  searchIcons:string = '';
  showCategoryName:boolean = false;
  categoryName: string = '';
  constructor( private fontService:FontsService,private sanitizer: DomSanitizer){

  }
  ngOnInit(): void {
    this.getAllIcons();
    this.getCategories();
  }
  getAllIcons(){
    this.fontService.getAllIcons().subscribe({
      next:(data:any) => {
        this.allIcons = data;
        this.showCategoryName = false;
        this.updateSvgContent()
      },
      error(err) {
        console.log(err);
      },
    })
  }
  getCategories(){
    this.fontService.getCategories().subscribe({
      next:(data:any) => {
        this.categories = data.value;
      },
      error(err) {
        console.log(err);
      },
    })
  }
  getCategoryIcon(category:string){
    let payload = {"category":category}
    this.fontService.getCategoryIcon(payload).subscribe({
      next:(data:any) => {
        this.showCategoryName = true;
        this.categoryName = category
        this.allIcons = data;
        this.updateSvgContent();
      },
      error(err) {
        console.log(err);
      },
    })
  }

  updateSvgContent(){
    if(this.allIcons.value){
      this.allIcons.value.forEach((icon: { sanitizedSVGContent: SafeHtml; svg: string; }) => {
        icon.svg = icon.svg.replace('<svg', `<svg class="lucide lucide-search search-icon" width="${this.strokeSize}" height="${this.strokeSize}"`);
        icon.sanitizedSVGContent = this.sanitizer.bypassSecurityTrustHtml(icon.svg) as string;
      });
    }
  }
  
  openPopup(data:any){
    this.svgDetails = data;
    this.show = true;
    this.svgContent = data.svg;
    this.updateStroke();
  }

  updateStroke(){
    this.svgCopy = this.svgContent.replace(
      'class="lucide lucide-search search-icon"',
      `class="h-75 w-100" stroke="${this.color}" stroke-width="${this.strokeWidth}"`
    );
    this.svgContentSafe = this.sanitizer.bypassSecurityTrustHtml(this.svgCopy) as string;
  }

  resetStroke(){
    this.strokeWidth = 2;
    this.strokeSize = 24;
    this.color = '#000000'
  }
  onColorChange(color: string): void {
    this.color = color;
    this.updateStroke()
  }

  showSubMenu(type:string){
    if(type == 'SVG'){
      this.svg = !this.svg;
    }
    if(type == 'JSX'){
      this.jsx = !this.jsx;
    }
  }
}
