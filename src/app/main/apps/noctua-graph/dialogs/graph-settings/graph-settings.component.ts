import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  NoctuaUserService,
  NoctuaFormConfigService,
  NoctuaFormMenuService,
  NoctuaActivityFormService,
  CamsService,
  CamService
} from 'noctua-form-base';
import { noctuaAnimations } from '@noctua/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime, takeUntil } from 'rxjs/operators';
import { NoctuaCommonMenuService } from '@noctua.common/services/noctua-common-menu.service';
import { SettingsOptions } from '@noctua.common/models/graph-settings';

@Component({
  selector: 'noc-graph-settings-dialog',
  templateUrl: './graph-settings.component.html',
  styleUrls: ['./graph-settings.component.scss'],
  animations: noctuaAnimations,
})
export class GraphSettingsDialogComponent implements OnInit, OnDestroy {

  displayedColumns = [
    'category',
    'count'
  ];

  settings: SettingsOptions;
  settingsForm: FormGroup;

  private _unsubscribeAll: Subject<any>;


  constructor(
    private _matDialogRef: MatDialogRef<GraphSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    public camsService: CamsService,
    public camService: CamService,
    private noctuaCommonMenuService: NoctuaCommonMenuService,
    public noctuaUserService: NoctuaUserService,
    public noctuaFormConfigService: NoctuaFormConfigService,
    public noctuaActivityFormService: NoctuaActivityFormService,
    public noctuaFormMenuService: NoctuaFormMenuService) {

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
    this._unsubscribeAll.next();
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

  confirm() {
    this._matDialogRef.close(true);
  }

  cancel() {
    this._matDialogRef.close();
  }
}