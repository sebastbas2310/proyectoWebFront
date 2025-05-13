import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module'; 
import { Ingredient } from 'src/app/models/ingredients.model';
import { ingredientsService } from 'src/app/services/ingredients/ingredients.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingredients-list',
  imports: [ CommonModule, MaterialModule, FormsModule ],
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

    updateQuantity(ingredient: Ingredient): void {
      if (ingredient.amountToAdd > 0) {
        // Crea un objeto con todos los atributos del ingrediente, actualizando solo la cantidad
        const updatedIngredient: Ingredient = {
          ingredient_id: ingredient.ingredient_id, // Mantén el ID
          ingredient_name: ingredient.ingredient_name, // Mantén el nombre
          ingredient_type: ingredient.ingredient_type, // Tipo de ingrediente (por ejemplo, vegetal, proteína, etc.)
          ingredient_cant: ingredient.ingredient_cant + ingredient.amountToAdd, // Actualiza la cantidad
          amountToAdd: 0 // Reinicia el campo de cantidad a sumar
        };

        this.IngredientsService.updateIngredients(updatedIngredient).subscribe({
          next: () => {
            alert('Cantidad actualizada correctamente');
            this.getIngredients(); // Refresca la lista de ingredientes
          },
          error: () => {
            alert('Error al actualizar la cantidad');
          }
        });

        // Reinicia el campo de cantidad a sumar en el frontend
        ingredient.amountToAdd = 0;
      } else {
        alert('Por favor, ingresa una cantidad válida para sumar.');
      }
    }
}





