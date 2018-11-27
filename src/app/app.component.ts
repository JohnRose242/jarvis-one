import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EventsService } from './events-service/events.service';
import { SpeechRecognizerService } from './shared/services/speech-recognizer.service';
import { SpeechNotification } from './shared/model/speech-notification';

@Component({
  selector: 'wsa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private synth = window.speechSynthesis;
  private voices = [];
  public welcomeMsg1 = 'Hello, my name is Jarvis.';
  public welcomeMsg2 = 'How may I help you?';
  public welcomeMsg3 = 'You may click on an option or simply speak your commands.';
  public utterance = '';
  public error = false;
  public notification;
  finalTranscript = '';
  constructor(
    private changeDetector: ChangeDetectorRef,
    private speechRecognizer: SpeechRecognizerService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.voices = this.synth.getVoices();
      this.utterance = `${this.welcomeMsg1} ${this.welcomeMsg2} ${this.welcomeMsg3}`;
      this.speak(this.utterance, 7500);
      this.initRecognition();
    }, 100);
    this.eventsService.on('show-reports', this.showReports.bind(this));
    this.eventsService.on('toggle-lights-on', this.toggleLightsOn.bind(this));
    this.eventsService.on('toggle-lights-off', this.toggleLightsOff.bind(this));
    this.eventsService.on('go-back', this.goBack.bind(this));
    this.speechRecognizer.initialize('en-US');

  }

  speak(text, delay = 5000) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voices.filter(voice => voice.name === 'Google UK English Male')[0];
    utterance.rate = 0.85;
    this.synth.speak(utterance);
    setTimeout(() => {
      this.finalTranscript = '';
      this.speechRecognizer.start(new Date().getTime());
    }, delay);
  }

  showReports() {
    this.utterance = `Here are your reports.`;
    this.detectChanges();
    this.eventsService.broadcast('jarvis-show-reports');
    this.speechRecognizer.stop();
    this.speak(this.utterance, 1200);
  }

  toggleLightsOn() {
    this.utterance = `Turning lights on.`;
    this.detectChanges();
    this.eventsService.broadcast('jarvis-toggle-lights-on');
    this.speechRecognizer.stop();
    this.speak(this.utterance, 1200);
  }

  toggleLightsOff() {
    this.utterance = `Turning lights off.`;
    this.detectChanges();
    this.eventsService.broadcast('jarvis-toggle-lights-off');
    this.speechRecognizer.stop();
    this.speak(this.utterance, 1200);
  }

  goBack() {
    this.utterance = `Returning to the Main Menu.`;
    this.detectChanges();
    this.eventsService.broadcast('jarvis-go-back');
    this.speechRecognizer.stop();
    this.speak(this.utterance, 1500);
  }

  private initRecognition() {
    this.speechRecognizer.onStart()
      .subscribe(data => {
        this.notification = 'I\'m listening...';
        this.detectChanges();
      });

    this.speechRecognizer.onEnd()
      .subscribe(data => {
        // this.speechRecognizer.stop();
        // this.speechRecognizer.start(new Date().getTime());
      });

    this.speechRecognizer.onResult()
      .subscribe((data: SpeechNotification) => {
        const message = data.content.trim();
        if (data.info === 'final_transcript' && message.length > 0) {
          this.error = false;
          this.finalTranscript = `${this.finalTranscript}\n${message}`;
          if (this.finalTranscript.includes('Jarvis')) {
            if (this.finalTranscript.includes('lights') && this.finalTranscript.includes('on')) {
              this.toggleLightsOn();
            } else if (this.finalTranscript.includes('lights') && this.finalTranscript.includes('off')) {
              this.toggleLightsOff();
            } else if (this.finalTranscript.includes('show') && this.finalTranscript.includes('reports')) {
              // this.showReports();
            } else if (this.finalTranscript.includes('back')) {
              this.goBack();
            } else {
              this.handleError();
            }
          } else {
            this.finalTranscript = '';
          }
        }
      });
  }

  detectChanges() {
    this.changeDetector.detectChanges();
  }

  handleError() {
    this.error = true;
    this.utterance = `I'm sorry but I do not understand that command. Please try again.`;
    this.detectChanges();
    this.speechRecognizer.stop();
    this.speak(this.utterance, 5000);
  }

}
