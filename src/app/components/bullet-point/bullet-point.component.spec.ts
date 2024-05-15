import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletPointComponent } from './bullet-point.component';

describe('BulletPointComponent', () => {
  let component: BulletPointComponent;
  let fixture: ComponentFixture<BulletPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulletPointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BulletPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
