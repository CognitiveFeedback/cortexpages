import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareComponent } from './software.component';
import { MandelbrotPixels } from './MandelbrotPixels';
import { Point2D } from './Point2D';
import { ComplexNumber } from './ComplexNumber';

describe('SoftwareComponent', () => {
  let component: SoftwareComponent;
  let fixture: ComponentFixture<SoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SoftwareComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should multiply two complex numbers', () => {
    let ops = new ComplexNumber();
    let result = ops.multiply(new Point2D(8.3, 17.5), new Point2D(1.4, 6.3));
    let expected = new Point2D(-98.63, 76.79);
    expect(result.x).toEqual(expected.x);
    expect(result.y).toEqual(expected.y);
  });

  it('should get the normal of', () => {
    let ops = new ComplexNumber();
    let result = ops.absoluteValue(new Point2D(1, 1));
    let expected = Math.sqrt(2);
    expect(result).toEqual(expected);
  });
});
