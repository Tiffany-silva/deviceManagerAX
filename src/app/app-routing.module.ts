
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, UserToken, Permissions } from './services/user/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AuthGuard]},
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'reset-password', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'profile/:id', loadChildren: './pages/profile/profile.module#ProfilePageModule', canActivate: [AuthGuard]},
  { path: 'device-list', loadChildren: './pages/device-list/device-list.module#DeviceListPageModule',canActivate: [AuthGuard] },
  { path: 'add-device', loadChildren: './pages/add-device/add-device.module#AddDevicePageModule',canActivate: [AuthGuard] },
  { path: 'device-detail/:id', loadChildren: './pages/device-detail/device-detail.module#DeviceDetailPageModule',canActivate: [AuthGuard] },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule', canActivate: [AuthGuard] },
  { path: 'user-list', loadChildren: './pages/user-list/user-list.module#UserListPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers:[UserToken, Permissions],
  exports: [RouterModule]
})

export class AppRoutingModule {}
