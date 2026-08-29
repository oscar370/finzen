import { Component, signal } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, MatSlideToggle],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('finzen');
}
