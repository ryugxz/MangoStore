import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderVendorPageComponent } from './order-vendor-page.component';

describe('OrderVendorPageComponent', () => {
  let component: OrderVendorPageComponent;
  let fixture: ComponentFixture<OrderVendorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderVendorPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderVendorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
