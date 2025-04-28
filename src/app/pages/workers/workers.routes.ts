import {Routes} from '@angular/router';
import { WorkerListComponent } from '../workers/worker-list/worker-list.component';


export const TrabajadoresRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            component: WorkerListComponent,
        },
    ],
}]