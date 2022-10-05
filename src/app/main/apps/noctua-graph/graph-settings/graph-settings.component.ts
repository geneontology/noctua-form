import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  NoctuaUserService,
  NoctuaFormConfigService,
  NoctuaActivityFormService,

  CamService
} from '@geneontology/noctua-form-base';
import { noctuaAnimations } from '@noctua/animations';
import { FormGroup } from '@angular/forms';
import { distinctUntilChanged, debounceTime, takeUntil } from 'rxjs/operators';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { SettingsOptions } from '@noctua.common/models/graph-settings';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'noc-graph-settings',
  templateUrl: './graph-settings.component.html',
  styleUrls: ['./graph-settings.component.scss'],
  animations: noctuaAnimations,
})
export class GraphSettingsComponent implements OnInit, OnDestroy {

  displayedColumns = [
    'category',
    'count'
  ];

  @Input('panelDrawer')
  panelDrawer: MatDrawer;

  settings: SettingsOptions;
  settingsForm: FormGroup;

  private _unsubscribeAll: Subject<any>;


  constructor(
    public camService: CamService,
    private noctuaCommonMenuService: NoctuaCommonMenuService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService
  ) {

    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.noctuaCommonMenuService.onCamSettingsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((settings: SettingsOptions) => {
        if (!settings) {
          return;
        }
        this.settings = settings;
        this.settingsForm = this.settings.createSettingsForm();
        this._onValueChanges();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


  createSettingsForm(settings: SettingsOptions) {

  }

  populateSettings(value) {
    this.settings.populateSettings(value);
    this.noctuaCommonMenuService.onCamSettingsChanged.next(this.settings);
  }

  private _onValueChanges() {
    const self = this;


    this.settingsForm.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(400),
      takeUntil(this._unsubscribeAll)
    ).subscribe(value => {
      self.populateSettings(value)
    });
  }

  close() {
    this.panelDrawer.close();
  }

}