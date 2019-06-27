import { Component  } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'KermitNg';
  options = {
    position: ['bottom', 'right'],
    timeout: 3000,
    showProgressBar: true,
    lastOnBottom: true,
    pauseOnHover:true
  }
}
