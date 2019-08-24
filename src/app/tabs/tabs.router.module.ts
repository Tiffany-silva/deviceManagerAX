import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/login/login.module').then(m => m.LoginPageModule)
          }
        ]
       },
      // {
      //   path: 'qr-scanner',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('').then(m => m.Tab2PageModule)
      //     }
      //   ]
      // },
      // {
      //   path: 'profile',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('').then(m => m.Tab3PageModule)
      //     }
      //   ]
       //}
       ,
      {
        path: '',
        redirectTo: '/src/app/pages/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/src/app/pages/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
