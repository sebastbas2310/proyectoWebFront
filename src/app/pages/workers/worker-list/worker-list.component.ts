import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { Workers } from 'src/app/models/workers.model';
import { WorkerService } from 'src/app/services/workers/worker.service';

@Component({
  selector: 'app-worker-list',
  imports: [MaterialModule, CommonModule],
  templateUrl: './worker-list.component.html',
  styleUrl: './worker-list.component.scss'
})
export class WorkerListComponent {
  workerList: Workers[] = [];

  constructor(private workerService: WorkerService){

  }

  ngOnInit(){
    this.getWorker();
  }

  getWorker(){
    this.workerService.getWorkers().subscribe(
      {
        next: (res) =>{
          this.workerList = res;
          console.log(this.workerList);
        },
        error: (err)=>{
          if(err.status === 403){
            localStorage.removeItem('AuthToken');
             //this.router
          }
        }
      }
    )
  }
}
