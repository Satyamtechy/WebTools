import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { LoadersService } from './services/loaders.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoaderCardComponent } from "./components/loader-card/loader-card.component";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalPopupComponent } from '../shared/components/modal-popup/modal-popup.component';
import { FontsComponent } from '../fonts/fonts.component';

@Component({
    selector: 'app-css-loaders',
    standalone: true,
    templateUrl: './css-loaders.component.html',
    styleUrl: './css-loaders.component.scss',
    imports: [CommonModule, MatCardModule, LoaderCardComponent]
})
export class CssLoadersComponent implements OnInit, OnDestroy{
  loaders: any = [];

  constructor(private loaderService:LoadersService, private renderer: Renderer2,private sanitizer: DomSanitizer,
    private dialog: MatDialog){}
  

  ngOnInit(): void {
    this.getLoaders()
  }

  getLoaders(){
    this.loaderService.getLoaders().subscribe({
      next:(data:any) => {
        this.loaders = data.value;
        this.updateLoaderContent();
      },
      error(err: any) {
        console.log(err);
      },
    })
  }

  updateLoaderContent(){
    if(this.loaders){
      this.loaders.forEach((data:{ sanitizedLoaderContent: SafeHtml; html:string, css:string},index:number) => {
        data.html = data.html.replace(`<span class="loader"`,`<span class="loader-${index+1}"`);
        console.log(data.html)
        data.css = data.css.replaceAll(`.loader`,`.loader-${index+1}`)
        console.log(data.css)
        data.sanitizedLoaderContent = this.sanitizer.bypassSecurityTrustHtml(data.html) as string;
      });
    }
  }

  private addCSSToHead(cssContent: string): void {
    const styleElement = this.renderer.createElement('style');
    this.renderer.appendChild(styleElement, this.renderer.createText(cssContent));
    this.renderer.appendChild(document.head, styleElement);
  }

  popup(){
    this.dialog.open(ModalPopupComponent,{
      width:"50%",
      height:"70%"
    });
  }

  ngOnDestroy(): void {
  }

}
