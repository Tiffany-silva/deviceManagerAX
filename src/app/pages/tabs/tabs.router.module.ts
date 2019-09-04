import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
    {
        path: "",
        redirectTo: "/tabs/device-list",
        pathMatch: "full"
    },
    {
        path: "",
        component: TabsPage,
        children: [
            {
                path: "device-list",
                loadChildren: () =>
                    import("src/app/pages/device-list/device-list.module").then(m => m.DeviceListPageModule), canActivate: [AngularFireAuthGuard],
            },
            {
                path: "profile/:id", loadChildren: () =>
                    import('../profile/profile.module').then(m => m.ProfilePageModule), canActivate: [AngularFireAuthGuard],
            },
            {
                path: "userList",
                loadChildren: () =>
                    import('../user-list/user-list.module').then(m => m.UserListPageModule), canActivate: [AngularFireAuthGuard],
            }

        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule { }
