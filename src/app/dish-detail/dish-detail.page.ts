import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DishService } from '../services/dish.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.page.html',
  styleUrls: ['./dish-detail.page.scss'],
})
export class DishDetailPage implements OnInit {
  idDish!: number;
  ingredients: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dishService: DishService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.idDish = Number(this.route.snapshot.paramMap.get('id'));
    this.loadIngredients();
  }

  loadIngredients() {
    this.dishService
      .getIngredientsForDish(this.idDish)
      .subscribe((response: any) => {
        this.ingredients = response.map((ingredient: any) => ({
          ...ingredient,
          quantity: ingredient.quantity || 0,
        }));
      });
  }

  increaseQuantity(ingredient: any) {
    ingredient.quantity++;
    this.dishService
      .updateIngredientForDish(
        this.idDish,
        ingredient.id_ingredient,
        ingredient.quantity
      )
      .subscribe(() => console.log('Cantidad actualizada'));
  }

  decreaseQuantity(ingredient: any) {
    if (ingredient.quantity > 0) {
      ingredient.quantity--;
      this.dishService
        .updateIngredientForDish(
          this.idDish,
          ingredient.id_ingredient,
          ingredient.quantity
        )
        .subscribe(() => console.log('Cantidad actualizada'));
    }
  }

  removeIngredient(idIngredient: number) {
    this.dishService
      .deleteIngredientFromDish(this.idDish, idIngredient)
      .subscribe(() => {
        this.ingredients = this.ingredients.filter(
          (i) => i.id_ingredient !== idIngredient
        );
      });
  }

  async addIngredient() {
    const alert = await this.alertController.create({
      header: 'Agregar Ingrediente',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre del Ingrediente',
        },
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Cantidad',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: (data) => {
            this.dishService
              .addIngredientToDish(this.idDish, {
                id_ingredient: 0, // Cambiar según lógica de identificación
                quantity: data.quantity,
              })
              .subscribe((newIngredient) => {
                this.ingredients.push({
                  ...newIngredient,
                  name: data.name,
                });
              });
          },
        },
      ],
    });

    await alert.present();
  }
}
