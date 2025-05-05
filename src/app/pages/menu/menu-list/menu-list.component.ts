import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menu } from 'src/app/models/Menu.model';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'app-menu-list',
  imports: [
    CommonModule
  ],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent {
 
  menuList: Menu[] = [];

  constructor(private menuService: MenuService){
  
  }
  
    ngOnInit(){
      this.getMenu();
    }    

    getMenu(){
      this.menuService.getMenu().subscribe(
        {
          next: (res) =>{
            this.menuList = res;
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
