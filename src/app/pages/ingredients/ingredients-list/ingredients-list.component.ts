import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module'; 
import { Ingredient } from 'src/app/models/ingredients.model';
import { ingredientsService } from 'src/app/services/ingredients/ingredients.service';

@Component({
  selector: 'app-ingredients-list',
  imports: [ CommonModule, MaterialModule ],
  templateUrl: './ingredients-list.component.html',
  styleUrl: './ingredients-list.component.scss'
})
export class IngredientsListComponent {
  
    ingredientsList:Ingredient[] = [];
  
    constructor(private IngredientsService: ingredientsService){
  
    }
  
    ngOnInit(){
      this.getIngredients();
    }
  
    getIngredients(){
      this.IngredientsService.getIngredients().subscribe(
        {
          next: (res) =>{
            this.ingredientsList = res;
            console.log(this.ingredientsList);
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
  


