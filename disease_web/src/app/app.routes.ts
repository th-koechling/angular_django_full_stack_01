import { Routes } from '@angular/router';
import { HomeComponent } from './disease/home/home.component';
import { CreateComponent } from './disease/create/create.component';
import { PanelComponent } from './disease/panel/panel.component';
import { GeneComponent } from './disease/gene/gene.component';
import { DetailViewComponent } from './disease/detail-view/detail-view.component';


// TODO: why the 'home/' path is needed?
export const routes: Routes = [
    {path: "diseases/home", component: HomeComponent},
    {path: "diseases", redirectTo:"diseases/home", pathMatch:"full"},
    {path: "", redirectTo:"diseases/home", pathMatch:"full"},
    {path: "create", component: CreateComponent},
    {path: "panels/home", component: PanelComponent},
    {path: "panels", redirectTo:"panels/home", pathMatch:"full"},
    {path: "genes/home", component: GeneComponent},
    {path: "genes", redirectTo:"genes/home", pathMatch:"full"},
    {path: "detail-view", component: DetailViewComponent},
    //{path: "detail-view", redirectTo:"detail-view/home", pathMatch:"full"},
];
