import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddDevicePage } from './add-device.page';

const routes: Routes = [
	{
		path: '',
		component: AddDevicePage
	}
];
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes)
	],
	declarations: [AddDevicePage]
})
export class AddDevicePageModule { }
