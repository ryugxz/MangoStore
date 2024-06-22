import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCustomerPageComponent } from './order-customer-page.component';

describe('OrderCustomerPageComponent', () => {
  let component: OrderCustomerPageComponent;
  let fixture: ComponentFixture<OrderCustomerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCustomerPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
