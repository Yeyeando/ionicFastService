import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DishService } from '../services/dish.service';
import { IngredientService } from '../services/ingredient.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.page.html',
  styleUrls: ['./dish-detail.page.scss'],
})
export class DishDetailPage implements OnInit {
  idDish!: number;
  ingredients: any[] = [];
  availableIngredients: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dishService: DishService,
    private ingredientService: IngredientService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.idDish = Number(this.route.snapshot.paramMap.get('id'));
    this.loadIngredients();
    this.loadAvailableIngredients();
  }

  loadIngredients() {
    this.dishService.getIngredientsForDish(this.idDish).subscribe(
      (response: any) => {
        this.ingredients = response.map((ingredient: any) => ({
          ...ingredient,
          quantity: ingredient.quantity || 0,
        }));
      },
      (error) => console.error('Error loading ingredients:', error)
    );
  }

  loadAvailableIngredients() {
    this.ingredientService.getDishes().subscribe(
      (response: any) => {
        const assignedIds = this.ingredients.map(
          (ingredient) => ingredient.idIngredient
        );
        this.availableIngredients = response.filter(
          (ingredient: any) => !assignedIds.includes(ingredient.id)
        );
      },
      (error) => console.error('Error loading available ingredients:', error)
    );
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
      console.log('No puedes añadir más de 3 unidades.');
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
    } else {
      console.log('No puedes quitar más unidades.');
    }
  }

  removeIngredient(ingredient: any) {
    this.dishService
      .deleteIngredientFromDish(this.idDish, ingredient.idIngredient)
      .subscribe(() => {
        this.ingredients = this.ingredients.filter(
          (i) => i.idIngredient !== ingredient.idIngredient
        );
        this.loadAvailableIngredients();
      });
  }

  async addIngredient() {
    const alert = await this.alertController.create({
      header: 'Agregar Ingrediente',
      inputs: [
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
          text: 'Seleccionar Ingrediente',
          handler: async (data) => {
            if (!data.quantity) {
              console.error('Debe especificar una cantidad.');
              return false; // Previene el cierre de la alerta si no se especifica cantidad
            }

            // Mostrar la segunda alerta para seleccionar un ingrediente
            const selectAlert = await this.alertController.create({
              header: 'Seleccionar Ingrediente',
              inputs: this.availableIngredients.map((ingredient) => ({
                type: 'radio',
                label: ingredient.name,
                value: ingredient.id, // El valor que representa al ingrediente seleccionado
              })),
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                },
                {
                  text: 'Agregar',
                  handler: (ingredientId) => {
                    if (!ingredientId) {
                      console.error('Debe seleccionar un ingrediente.');
                      return false; // Previene el cierre de la alerta si no se selecciona un ingrediente
                    }

                    // Agregar el ingrediente al plato
                    this.dishService
                      .addIngredientToDish(this.idDish, {
                        id_ingredient: ingredientId,
                        quantity: data.quantity,
                      })
                      .subscribe(
                        (newIngredient: any) => {
                          this.ingredients.push(newIngredient); // Agrega el nuevo ingrediente a la lista
                          this.loadAvailableIngredients(); // Recarga los ingredientes disponibles
                        },
                        (error) =>
                          console.error(
                            'Error al agregar el ingrediente:',
                            error
                          )
                      );
                    console.log('Ingrediente seleccionado:', ingredientId);

                    return true; // Permite cerrar la alerta si todo está correcto
                  },
                },
              ],
            });

            await selectAlert.present();
            return true; // Permite cerrar la primera alerta
          },
        },
      ],
    });

    await alert.present();
  }
}
