import { AuthGuard } from '../../services/user/auth.guard';
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
                            import("src/app/pages/device-list/device-list.module").then(m => m.DeviceListPageModule), canActivate: [AuthGuard],
            },
            {
                path: "scanner",
                loadChildren: ()=>
                import('../scanner/scanner.module').then(m=>m.ScannerPageModule), canActivate:[AuthGuard],
            },
            // {
            //     path: "profile", loadChildren: ()=>
            //     import('../profile/profile.module').then(m=>m.ProfilePageModule),canActivate: [AuthGuard],
            // }
           
        ]
    },
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule { }
