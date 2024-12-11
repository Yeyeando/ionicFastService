import { Component, OnInit } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.page.html',
  styleUrls: ['./dishes.page.scss'],
})
export class DishesPage implements OnInit {
  dishes: any = [];

  constructor(private dishService: DishService, private router: Router) {}

  ngOnInit() {
    this.getAllDishes();
  }

  getAllDishes() {
    this.dishService.getDishes().subscribe(
      (response) => {
        console.log('Dishes Response:', response); // Verifica la estructura de los datos
        this.dishes = response;
      },
      (error) => {
        console.error('Error fetching dishes:', error);
      }
    );
  }

  openDishDetail(idDish: number) {
    console.log('Dish ID received:', idDish); // Muestra el ID recibido
    if (!idDish) {
      console.error('Invalid Dish ID:', idDish);
      return;
    }
    this.router.navigate([`/dish-detail/${idDish}`]);
  }
}
