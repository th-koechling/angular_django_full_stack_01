import { Routes } from '@angular/router';
import { HomeComponent } from './disease/home/home.component';
import { PanelComponent } from './disease/panel/panel.component';
import { DetailViewComponent } from './disease/detail-view/detail-view.component';


export const routes: Routes = [
    {path: "diseases/home", component: HomeComponent},
    {path: "diseases", redirectTo:"diseases/home", pathMatch:"full"},
    {path: "", redirectTo:"diseases/home", pathMatch:"full"},
    {path: "panels/home", component: PanelComponent},
    {path: "panels", redirectTo:"panels/home", pathMatch:"full"},
    {path: "detail-view", component: DetailViewComponent},
    //{path: "detail-view", redirectTo:"detail-view/home", pathMatch:"full"},
];
