import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { UnathorizedOnlyGuard } from 'src/app/auth/shared/unauthorized-only.guard';
import { AuthGuard } from 'src/app/auth/shared/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'not-found', loadChildren: () => import('src/app/static-pages/not-found/not-found.page.module').then((mod) => mod.NotFoundPageModule) },
      { path: 'imprint', loadChildren: () => import('src/app/static-pages/imprint/imprint.page.module').then((mod) => mod.ImprintPageModule) },
      { path: 'god-mode', loadChildren: () => import('src/app/god-mode/god-mode/god-mode.page.module').then((mod) => mod.GodModePageModule) },
      { path: 'agreements', loadChildren: () => import('src/app/legal/agreement/agreement.page.module').then((mod) => mod.AgreementPageModule) },
      { path: 'agreements/:type', loadChildren: () => import('src/app/legal/agreement/agreement.page.module').then((mod) => mod.AgreementPageModule) },
      { path: 'login', canActivate: [UnathorizedOnlyGuard], loadChildren: () => import('src/app/auth/login/login.page.module').then((mod) => mod.LoginPageModule) },
      { path: 'register', canActivate: [UnathorizedOnlyGuard], loadChildren: () => import('src/app/auth/register/register.page.module').then((mod) => mod.RegisterPageModule) },
      { path: 'password-reset', canActivate: [UnathorizedOnlyGuard], loadChildren: () => import('src/app/auth/password-reset/password-reset.page.module').then((mod) => mod.PasswordResetPageModule) },
      { path: 'password-reset/:token', canActivate: [UnathorizedOnlyGuard], loadChildren: () => import('src/app/auth/password-reset/password-reset.page.module').then((mod) => mod.PasswordResetPageModule) },
      {
        path: 'likes',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/like/like-list/like-list.page.module').then((mod) => mod.LikeListPageModule),
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () => import('src/app/user/user-edit/user-edit.page.module').then((mod) => mod.UserEditPageModule),
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            loadChildren: () => import('../event/event-list/event-list.page.module').then((mod) => mod.EventListPageModule),
          },
          {
            path: ':id',
            loadChildren: () => import('../event/event-detail/event-detail.page.module').then((mod) => mod.EventDetailPageModule),
pathMatch: 'full',
          },
        ],
      },
      {
        path: 'locations',
        children: [
          {
            path: ':id',
            loadChildren: () => import('../location/location-detail/location-detail.page.module').then((mod) => mod.LocationDetailPageModule),
          },
        ],
      },
      {
        path: 'ads',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'my-ads',
            loadChildren: () => import('../ad/own-ad-list/own-ad-list.page.module').then((mod) => mod.OwnAdListPageModule),
          },
        ],
      },
      {
        path: 'conversations',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('../conversation/conversation-list/conversation-list.page.module').then((mod) => mod.ConversationListPageModule),
          },
          {
            path: ':id',
            loadChildren: () => import('../conversation/conversation-detail/conversation-detail.page.module').then((mod) => mod.ConversationDetailPageModule),
          },
        ],
      },
      {
        path: 'more',
        children: [
          {
            path: '',
            loadChildren: () => import('../static-pages/more-menu/more-menu.page.module').then((mod) => mod.MoreMenuPageModule),
          },
          {
            path: 'imprint',
            loadChildren: () => import('../static-pages/imprint/imprint.page.module').then((mod) => mod.ImprintPageModule),
          },
          {
            path: 'agreements/:type',
            loadChildren: () => import('src/app/legal/agreement/agreement.page.module').then((mod) => mod.AgreementPageModule),
          },
        ],
      },
      { path: '', loadChildren: () => import('src/app/home/home/home.page.module').then((mod) => mod.HomePageModule) },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
// tslint:disable-next-line
export class MainRoutingModule { }
