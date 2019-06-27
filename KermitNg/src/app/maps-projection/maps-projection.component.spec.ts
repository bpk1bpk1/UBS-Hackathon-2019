import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsProjectionComponent } from './maps-projection.component';

describe('MapsProjectionComponent', () => {
  let component: MapsProjectionComponent;
  let fixture: ComponentFixture<MapsProjectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsProjectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsProjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
