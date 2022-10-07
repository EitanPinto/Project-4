import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdPanelHomepageComponent } from './third-panel-homepage.component';

describe('ThirdPanelHomepageComponent', () => {
  let component: ThirdPanelHomepageComponent;
  let fixture: ComponentFixture<ThirdPanelHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirdPanelHomepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdPanelHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
