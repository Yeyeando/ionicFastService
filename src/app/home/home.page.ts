import { Component, OnInit } from '@angular/core';
import { TablesService } from '../services/tables.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  tables: any = [];
  constructor(private tableService: TablesService, private router: Router) {}

  gotoDishes(avaibility: boolean) {
    if (avaibility == true) {
      this.router.navigateByUrl('/dishes');
    }
  }

  ngOnInit() {
    this.getAllTables();
  }

  getAllTables() {
    this.tableService.getTables().subscribe((response) => {
      this.tables = response;
    });
  }

  toggleAvailability(table: any) {
    if (!table.id) {
      console.error('Error: ID is undefined for table', table);
      return;
    }

    const newAvailability = !table.availability;
    this.tableService.updateAvailability(table.id, newAvailability).subscribe(
      () => {
        table.availability = newAvailability; // Actualiza localmente después de cambiar
      },
      (error) => {
        console.error('Error updating availability:', error);
      }
    );
  }
}
