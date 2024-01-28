import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/header/header.component";
import { FormsModule } from '@angular/forms';
import { CodeFormatterComponent } from './code-formatter/code-formatter.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, HeaderComponent,FormsModule,CodeFormatterComponent]
})
export class AppComponent {
  title = 'angular';
}
