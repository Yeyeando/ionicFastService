import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DishesPage } from './dishes.page';

describe('DishesPage', () => {
  let component: DishesPage;
  let fixture: ComponentFixture<DishesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DishesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
