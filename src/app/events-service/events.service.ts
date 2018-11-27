import { Injectable } from '@angular/core';
import { Subject, from } from 'rxjs';

@Injectable()
export class EventsService {
  private listeners;
  private eventsSubject;
  private events;
  constructor() {
    this.listeners = {};
    this.eventsSubject = new Subject();

    this.events = from(this.eventsSubject);

    this.events.subscribe(
      ({name, args}) => {
        if (this.listeners[name]) {
          for (const listener of this.listeners[name]) {
            listener(...args);
          }
        }
      });
  }

  on(name, listener): void {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }

    this.listeners[name].push(listener);
  }

  broadcast(name, ...args): void {
    this.eventsSubject.next({
      name,
      args
    });
  }
}
