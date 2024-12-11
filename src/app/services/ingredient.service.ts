import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  endpoint = 'http://localhost:8080/ingredients';
  constructor(private HttpClient: HttpClient) {}

  getDishes() {
    return this.HttpClient.get(this.endpoint);
  }
}
