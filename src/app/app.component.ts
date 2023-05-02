import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VerticalNavComponent } from './components/navigation/vertical-nav/vertical-nav.component';

@Component({
  selector: 'my-app',
  standalone: true,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, RouterModule, VerticalNavComponent],
})
export class App {
  title = 'Form Schema Examples';
}
