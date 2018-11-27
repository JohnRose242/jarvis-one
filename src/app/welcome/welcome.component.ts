import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventsService } from '../events-service/events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wsa-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  public lightsOn = false;

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.eventsService.on('jarvis-toggle-lights-on', this.toggleLightsOn.bind(this));
    this.eventsService.on('jarvis-toggle-lights-off', this.toggleLightsOff.bind(this));
    this.eventsService.on('jarvis-show-reports', this.showReports.bind(this));
  }

  showReports(broadcast = false) {
    if (broadcast) {
      this.eventsService.broadcast(`show-reports`);
    }
    this.router.navigate([`/reports`]);
  }

  toggleLights(next, broadcast = false) {
    this.lightsOn = next === 'On';
    this.detectChanges();
    if (broadcast) {
      this.eventsService.broadcast(`toggle-lights-${next.toLowerCase()}`);
    }
  }

  toggleLightsOn() {
    this.toggleLights('On');
  }

  toggleLightsOff() {
    this.toggleLights('Off');
  }

  detectChanges() {
    this.changeDetector.detectChanges();
  }
}
