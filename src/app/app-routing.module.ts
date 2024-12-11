import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dishes',
    loadChildren: () =>
      import('./dishes/dishes.module').then((m) => m.DishesPageModule),
  },
  {
    path: 'dish-detail/:id',
    loadChildren: () =>
      import('./dish-detail/dish-detail.module').then(
        (m) => m.DishDetailPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
