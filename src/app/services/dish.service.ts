import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  endpoint = 'http://localhost:8080/dishes';

  constructor(private HttpClient: HttpClient) {}

  // Obtener todos los platillos
  getDishes() {
    return this.HttpClient.get(this.endpoint);
  }

  getIngredientById(idIngredient: number) {
    return this.HttpClient.get(
      `http://localhost:8080/ingredients/${idIngredient}`
    );
  }

  // Obtener ingredientes relacionados con un platillo
  getIngredientsForDish(idDish: number) {
    return this.HttpClient.get(`http://localhost:8080/contains/${idDish}`);
  }

  // Agregar un ingrediente a un platillo
  addIngredientToDish(
    idDish: number,
    ingredient: { id_ingredient: number; quantity: number }
  ) {
    return this.HttpClient.post(`http://localhost:8080/contains`, {
      id_dish: idDish,
      ...ingredient,
    });
  }

  // Actualizar la cantidad de un ingrediente para un platillo
  updateIngredientForDish(
    idDish: number,
    idIngredient: number,
    quantity: number
  ) {
    return this.HttpClient.put(
      `http://localhost:8080/contains/${idDish}/${idIngredient}`,
      { id_dish: idDish, id_ingredient: idIngredient, quantity: quantity }
    );
  }

  // Eliminar un ingrediente de un platillo
  deleteIngredientFromDish(idDish: number, idIngredient: number) {
    return this.HttpClient.delete(
      `http://localhost:8080/contains/${idDish}/${idIngredient}`
    );
  }
}
