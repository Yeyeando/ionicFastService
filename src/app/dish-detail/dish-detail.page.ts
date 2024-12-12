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
    console.log('datos mostrados');
  }

  increaseQuantity(ingredient: any) {
    if (ingredient.quantity < 3) {
      ingredient.quantity++;
      this.dishService
        .updateIngredientForDish(
          this.idDish,
          ingredient.idIngredient,
          ingredient.quantity
        )
        .subscribe(() => console.log('Cantidad actualizada'));
    } else {
      console.log('No puedes añadir más de 3 ingredientes');
    }
  }

  decreaseQuantity(ingredient: any) {
    if (ingredient.quantity > 1) {
      ingredient.quantity--;
      this.dishService
        .updateIngredientForDish(
          this.idDish,
          ingredient.idIngredient,
          ingredient.quantity
        )
        .subscribe(() => console.log('Cantidad actualizada'));
      if (ingredient.quantity <= 0) {
        this.removeIngredient(ingredient);
        this.loadIngredients();
      }
    } else {
      console.log('No puedes quitar más ingredientes');
    }
  }

  removeIngredient(ingredient: any) {
    this.dishService
      .deleteIngredientFromDish(this.idDish, ingredient.idIngredient)
      .subscribe(() => {
        this.ingredients = this.ingredients.filter(
          (i) => i.idIngredient !== ingredient
        );
      });
    console.log('eliminado correctamente');
    this.loadIngredients();
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
                id_ingredient: 0,
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
