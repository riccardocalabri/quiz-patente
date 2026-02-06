import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Generale } from './generale';

describe('Generale', () => {
  let component: Generale;
  let fixture: ComponentFixture<Generale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Generale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Generale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
