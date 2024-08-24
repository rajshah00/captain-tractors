import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { CommanService } from 'src/app/services/comman.service';

@Component({
  selector: 'app-parts-order',
  templateUrl: './parts-order.component.html',
  styleUrls: ['./parts-order.component.scss']
})
export class PartsOrderComponent implements OnInit {
  constructor(
    public service: ApiServiceService,
    public comman: CommanService,
    public router: Router,
  ) { }
  ngOnInit(): void {

  }

  rouerNavigate(type: any) {
    this.router.navigate(['/purchase-order'], {
      queryParams: { type: type }
    });
  }

}
