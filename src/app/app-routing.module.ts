import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'reset-password', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' },
  { path: 'profile/:id', loadChildren: './pages/profile/profile.module#ProfilePageModule', canActivate: [AngularFireAuthGuard]},
  { path: 'device-list', loadChildren: './pages/device-list/device-list.module#DeviceListPageModule',canActivate: [AngularFireAuthGuard] },
  { path: 'add-device', loadChildren: './pages/add-device/add-device.module#AddDevicePageModule',canActivate: [AngularFireAuthGuard]},
  { path: 'device-detail/:id', loadChildren: './pages/device-detail/device-detail.module#DeviceDetailPageModule',canActivate: [AngularFireAuthGuard] },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule', canActivate: [AngularFireAuthGuard] },
  { path: 'user-list', loadChildren: './pages/user-list/user-list.module#UserListPageModule', canActivate: [AngularFireAuthGuard]}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}
