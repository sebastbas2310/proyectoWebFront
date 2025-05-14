import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { Component} from '@angular/core';
import Swal from 'sweetalert2';
import { Table } from 'src/app/models/tables.model';
import { TableService } from 'src/app/services/table/table.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-list',
   imports: [MaterialModule, CommonModule],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent {
  tableList: Table[] = [];

  constructor(private tableService: TableService, private router: Router) {}

  ngOnInit(): void {
    this.getTable();
  }

  getTable(): void {
    this.tableService.getTable().subscribe({
      next: (res) => {
        this.tableList = res;
        console.log(this.tableList);
      },
      error: (err) => {
        if (err.status === 403) {
          localStorage.removeItem('AuthToken');
        }
      }
    });
  }

  openTableDetails(table: Table): void {
    let timeLeft = 0;

    if (!table.table_disp) {
      // Calcula el tiempo restante si la mesa está ocupada
      const reservationEndTime = Date.now() + 3600000; // Simula el tiempo restante
      timeLeft = reservationEndTime - Date.now();
    }

    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval); // Detener el temporizador cuando expire
      } else {
        timeLeft -= 1000; // Reducir el tiempo restante
      }
    }, 1000);

    Swal.fire({
      title: `<strong>Detalles de la Mesa</strong>`,
      html: `
        <p><strong>ID:</strong> ${table.table_id}</p>
        <p><strong>Tamaño:</strong> ${table.table_size}</p>
        <p><strong>Estado:</strong> ${table.table_disp ? 'Desocupada' : 'Ocupada'}</p>
        ${
          !table.table_disp
            ? `<p><strong>Tiempo Restante:</strong> ${Math.floor(timeLeft / 60000)} minutos</p>`
            : ''
        }
      `,
      confirmButtonText: 'Cerrar'
    }).then(() => {
      clearInterval(interval); // Detener el temporizador cuando se cierre el popup
    });
  }

  reserveTable(table: Table): void {
    if (!table.table_disp) {
      Swal.fire({
        icon: 'error',
        title: 'Mesa Ocupada',
        text: 'Esta mesa ya está ocupada y no puede ser reservada.',
        confirmButtonText: 'Cerrar'
      });
      return;
    }

    Swal.fire({
      title: 'Reservar Mesa',
      text: `¿Estás seguro de que deseas reservar la mesa con ID ${table.table_id}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Reservar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        table.table_disp = false; // Cambia el estado a "Ocupada"

        // Actualiza el estado de la mesa en la base de datos
        this.tableService.updateTableStatus(table).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Mesa Reservada',
              text: `La mesa con ID ${table.table_id} ha sido reservada con éxito.`,
              confirmButtonText: 'Cerrar'
            });

            // Temporizador para liberar la mesa después de 1 hora (3600000 ms)
            setTimeout(() => {
              table.table_disp = true; // Cambia el estado a "Desocupada"

              // Actualiza el estado de la mesa en la base de datos nuevamente
              this.tableService.updateTableStatus(table).subscribe({
                next: () => {
                  Swal.fire({
                    icon: 'info',
                    title: 'Reserva Expirada',
                    text: `La mesa con ID ${table.table_id} ahora está disponible nuevamente.`,
                    confirmButtonText: 'Cerrar'
                  });
                },
                error: () => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo actualizar el estado de la mesa en la base de datos.',
                    confirmButtonText: 'Cerrar'
                  });
                }
              });
            }, 3600000); // 1 hora en milisegundos
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo reservar la mesa. Inténtalo de nuevo más tarde.',
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }
    });
  }
}

export class AppModule { }