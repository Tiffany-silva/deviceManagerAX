import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceDetailPage } from './device-detail.page';

describe('DeviceDetailPage', () => {
	let component: DeviceDetailPage;
	let fixture: ComponentFixture<DeviceDetailPage>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeviceDetailPage],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeviceDetailPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
