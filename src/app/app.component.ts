import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiServiceService } from './services/api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'captain-tractors';
  isLoading = false;
  constructor(private spinnerService: ApiServiceService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.spinnerService.spinnerState$.subscribe((isLoading: any) => {
      this.isLoading = isLoading;
      this.cdr.detectChanges();
    });
  }
}
