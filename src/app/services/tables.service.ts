import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class TablesService {
  endpoint = 'http://localhost:8080/tables';
  constructor(private HttpClient: HttpClient) {}

  getTables() {
    return this.HttpClient.get<any[]>(this.endpoint);
  }

  updateAvailability(id: number, availability: boolean) {
    return this.HttpClient.put(
      `${this.endpoint}/${id}/availability`,
      availability
    );
  }
}
