import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventsService } from '../events-service/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wsa-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {


  constructor(
    private eventsService: EventsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.eventsService.on('jarvis-go-back', this.go.bind(this));
  }
  goBack() {
    this.eventsService.broadcast(`go-back`);
    this.go();
  }

  go() {
    this.router.navigate([`/welcome`]);
  }



}
