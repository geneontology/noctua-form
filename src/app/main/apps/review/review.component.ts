
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';

import { noctuaAnimations } from '@noctua/animations';

import { NoctuaTranslationLoaderService } from '@noctua/services/translation-loader.service';
import { locale as english } from './i18n/en';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  animations: noctuaAnimations
})
export class ReviewComponent implements OnInit, OnDestroy {

  private unsubscribeAll: Subject<any>;

  constructor(private route: ActivatedRoute,
    private noctuaTranslationLoader: NoctuaTranslationLoaderService) {
    this.noctuaTranslationLoader.loadTranslations(english);

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
