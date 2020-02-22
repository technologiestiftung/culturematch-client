import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { NotFoundPage } from 'src/app/static-pages/not-found/not-found.page';

const routes: Routes = [
  {
    path: '',
    canActivate: [],
    loadChildren: () => import('./main/main.module').then((mod) => mod.MainModule),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
// tslint:disable-next-line
export class AppRoutingModule {}
