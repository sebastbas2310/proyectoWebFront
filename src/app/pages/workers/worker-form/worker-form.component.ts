import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Workers } from 'src/app/models/workers.model';
import { AlertService } from 'src/app/services/alert/alert.service';
import { WorkerService } from 'src/app/services/workers/worker.service';

@Component({
  selector: 'app-worker-form',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './worker-form.component.html',
  styleUrl: './worker-form.component.scss'
})
export class WorkerFormComponent {
  form!: FormGroup;
  editMode: boolean = false; // Determina si estamos en modo edición
  workerId!: string; // ID del trabajador en caso de edición

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workerService: WorkerService,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {}

  // Inicializa el formulario con todos los campos del modelo Workers
  initForm(): void {
    this.form = this.fb.group({
      worker_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      worker_status: ['Activo', Validators.required],
      worker_rol: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      password: ['', Validators.required],
      phone_number: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initForm();

    // Verifica si hay un ID en la URL para determinar si es edición o creación
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.workerId = id;
        this.editMode = true; // Modo edición
        this.getWorkerById(id);
      } else {
        this.editMode = false; // Modo creación
      }
    });
  }

  // Obtiene los datos de un trabajador por su ID y los carga en el formulario
  getWorkerById(id: string): void {
    this.workerService.getWorkerById(id).subscribe({
      next: (worker: Workers) => {
        this.form.patchValue({
          worker_name: worker.worker_name,
          email: worker.email,
          worker_status: worker.worker_status,
          worker_rol: worker.worker_rol,
          salary: worker.salary,
          password: worker.password,
          phone_number: worker.phone_number
        });
      },
      error: () => {
        console.log("Error al obtener los datos del trabajador.");
      }
    });
  }

  // Guarda la información del trabajador (creación o edición)
  guardarWorkerInfo(): void {
    this.alertService.alertaConCorfirmacion("¿Está seguro de guardar los cambios?", "Esta acción no se puede deshacer").then(result => {
    if (!result.isConfirmed) {}
    else if (result.isConfirmed) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert("Hubo un error al mapear los datos");
      return;
    }

    const workerData: Workers = this.form.value;

    const { worker_name, worker_rol, salary, email, phone_number } = workerData;
    if (!worker_name || !worker_rol || !salary || !email || !phone_number) {
      alert("Todos los campos son obligatorios");
      return;
    }

    // Imprime los datos enviados al backend
    console.log("Datos enviados al backend:", workerData);

    if (this.editMode && this.workerId) {
      // Actualiza un trabajador existente
      this.workerService.updateWorker(this.workerId, workerData).subscribe({
        next: () => {
          this.alertService.AlertaCuandoMelo("Excelente", "El trabajador ha sido modificado correctamente").then(result => {
            if (result.isConfirmed) {
              
              this.router.navigate(['/workers/list']);
            }
          });
        },
        error: () => {
          console.log("Error al actualizar el trabajador.");
        }
      });
    } else {
      // Crea un nuevo trabajador
      this.workerService.addWorker(workerData).subscribe({
        next: () => {
          this.alertService.AlertaCuandoMelo("Excelente", "El trabajador ha sido creado correctamente").then(result => {
            if (result.isConfirmed) {
              this.router.navigate(["/workers/list"]);
            }
          });
        },
        error: () => {
          console.log("Error al crear el trabajador.");
        }
      });
    }
    }});
  }
}
