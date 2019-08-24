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
       }
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
