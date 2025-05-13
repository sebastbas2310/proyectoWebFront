import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Menu } from 'src/app/models/Menu.model';
import { MenuService } from 'src/app/services/menu/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-list',
  imports: [MaterialModule, CommonModule],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent {
  menuList: Menu[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.getMenu();
  }

  getMenu() {
    this.menuService.getMenu().subscribe({
      next: (res) => {
        this.menuList = res;
        console.log(this.menuList);
      },
      error: (err) => {
        if (err.status === 403) {
          localStorage.removeItem('AuthToken');
          // this.router
        }
      }
    });
  }

  openMenuDetails(menu: Menu): void {
    Swal.fire({
      title: `<strong>${menu.plate_name}</strong>`,
      html: `
        <img src="${menu.plate_img}" alt="Imagen de ${menu.plate_name}" style="width: 100%; height: auto; margin-bottom: 15px; border-radius: 8px;">
        <p><strong>ID:</strong> ${menu.plate_id}</p>
        <p><strong>Nombre:</strong> ${menu.plate_name}</p>
        <p><strong>Descripción:</strong> ${menu.plate_desc}</p>
        <p><strong>Precio:</strong> $${menu.price}</p>
        <p><strong>Categoría:</strong> ${menu.plate_cat}</p>
      `,
      confirmButtonText: 'Cerrar'
    });
  }
}
