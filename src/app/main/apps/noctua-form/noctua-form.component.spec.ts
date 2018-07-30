import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoctuaFormComponent } from './review.component';

describe('NoctuaFormComponent', () => {
  let component: NoctuaFormComponent;
  let fixture: ComponentFixture<NoctuaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoctuaFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoctuaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
