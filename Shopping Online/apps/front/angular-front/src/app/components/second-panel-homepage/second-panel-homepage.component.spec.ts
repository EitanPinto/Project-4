import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondPanelHomepageComponent } from './second-panel-homepage.component';

describe('SecondPanelHomepageComponent', () => {
  let component: SecondPanelHomepageComponent;
  let fixture: ComponentFixture<SecondPanelHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondPanelHomepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondPanelHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
