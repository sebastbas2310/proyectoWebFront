import {Routes} from '@angular/router';
import { IngredientsFormComponent } from './ingredients-form/ingredients-form.component';
import { IngredientsListComponent } from './ingredients-list/ingredients-list.component';
 
export const ingredientsRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            component: IngredientsListComponent,
        },
        {
            path: '',
            component: IngredientsFormComponent,
        },
    ],
}]