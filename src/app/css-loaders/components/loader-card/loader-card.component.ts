import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader-card.component.html',
  styleUrl: './loader-card.component.scss'
})
export class LoaderCardComponent implements OnInit{
  @Input() html:any;
  @Input() css:any;

  constructor(private renderer: Renderer2,){}

  ngOnInit(): void {
    this.addCSSToHead();
  }

  addCSSToHead(): void {
    const styleElement = this.renderer.createElement('style');
    this.renderer.appendChild(styleElement, this.renderer.createText(this.css));
    this.renderer.appendChild(document.head, styleElement);
  }
}
