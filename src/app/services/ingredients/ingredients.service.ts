import { Injectable } from '@angular/core';
import {HttpClient} from'@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/app/models/ingredients.model';


@Injectable({
  providedIn: 'root'
})
export class ingredientsService {
  
    private servidor = 'http://localhost:3000/ingredient';
  
    constructor(private http: HttpClient) { }
  
    getIngredients(): Observable<Ingredient[]>{ 
      const endpoint = this.servidor;
      const headers = {
        'Content-Type':"application/json",
        'Authorization': `Bearer ${localStorage.getItem('AuthToken')}`
      }
      return this.http.get<Ingredient[]>(endpoint,{headers});
    }

   updateIngredients( ingredients: Ingredient): Observable<any>{
    const endpoint = `${this.servidor}/updateIngredient/${ingredients.ingredient_id}`;
    return this.http.put(endpoint, ingredients);
  }
      


}
