import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngFor, *ngIf
import { MatTableModule } from '@angular/material/table'; // Para la tabla de historial
import { MatCardModule } from '@angular/material/card';   // Para el contenedor principal
import { MatFormFieldModule } from '@angular/material/form-field'; // Para los campos de filtro
import { MatInputModule } from '@angular/material/input';     // Para input de búsqueda
import { MatSelectModule } from '@angular/material/select';   // Para el selector de estado/especialidad
import { MatDatepickerModule } from '@angular/material/datepicker'; // Para el rango de fechas
import { MatNativeDateModule } from '@angular/material/core'; // Necesario para MatDatepicker
import { MatButtonModule } from '@angular/material/button';   // Para el botón de búsqueda/limpiar
import { MatDividerModule } from '@angular/material/divider'; // <--- ¡Importación Añadida!
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms'; // Para los formularios reactivos de filtros

// Importar los servicios y las interfaces
import { Appointment, AppointmentService } from '../../services/appointment.service';
import { Doctor, DoctorService } from '../../../doctors/services/doctor.service';
import { map } from 'rxjs'; // Necesario para la transformación de datos

@Component({
  selector: 'app-appointment-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDividerModule, // <--- ¡Añadido a los imports del componente!
    ReactiveFormsModule
  ],
  templateUrl: './appointment-history.component.html',
  styleUrl: './appointment-history.component.css'
})
export class AppointmentHistoryComponent implements OnInit {

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = []; // La lista que se mostrará en la tabla
  displayedColumns: string[] = ['patientName', 'doctorName', 'specialty', 'appointmentDate', 'appointmentTime', 'status'];

  searchForm!: FormGroup;
  appointmentStatuses: string[] = ['Confirmada', 'Realizada', 'Cancelada'];
  specialties: string[] = []; // Se llenará con las especialidades de los médicos
  minDate: Date;
  maxDate: Date;
  doctors: Doctor[] = []; // <--- Declaración de la propiedad 'doctors' a nivel de clase

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService
  ) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 5); // Ejemplo: Rango de 5 años atrás
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1); // Ejemplo: Hasta 1 año en el futuro
  }

  ngOnInit(): void {
    this.initSearchForm();
    this.loadSpecialties();
    this.loadAppointments();

    // Opcional: Escuchar cambios en el formulario para aplicar filtros en tiempo real
    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  initSearchForm(): void {
    this.searchForm = new FormGroup({
      searchText: new FormControl(''), // Búsqueda por paciente o médico
      statusFilter: new FormControl(''), // Filtro por estado
      specialtyFilter: new FormControl(''), // Filtro por especialidad
      startDate: new FormControl(null), // Filtro por rango de fechas
      endDate: new FormControl(null),
    });
  }

  loadSpecialties(): void {
    this.doctorService.getDoctors().pipe(
      map(doctors => [...new Set(doctors.map(d => d.specialty))]) // Obtener especialidades únicas
    ).subscribe(specialties => {
      this.specialties = ['Todas', ...specialties]; // Añadir 'Todas' como opción
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(data => {
      // Para cada cita, intenta obtener el nombre del médico y la especialidad
      // Esto es temporal mientras el backend no los provee directamente en la cita
      // REMOVED THE REDUNDANT DECLARATION HERE
      this.doctorService.getDoctors().subscribe(doctorsData => {
        this.doctors = doctorsData; // Asigna los datos de los doctores a la propiedad de la clase
        this.appointments = data.map(appointment => {
          const doctor = this.doctors.find(d => d.id === appointment.doctorId);
          return {
            ...appointment,
            doctorName: doctor ? doctor.name : 'Desconocido',
            specialty: doctor ? doctor.specialty : 'Desconocida'
          };
        });
        this.applyFilters(); // Aplicar filtros iniciales
      });
    });
  }

  applyFilters(): void {
    const { searchText, statusFilter, specialtyFilter, startDate, endDate } = this.searchForm.value;

    let tempAppointments = [...this.appointments];

    // 1. Filtrar por búsqueda de texto (paciente o médico)
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      tempAppointments = tempAppointments.filter(app =>
        app.patientName.toLowerCase().includes(lowerSearchText) ||
        (app.doctorName && app.doctorName.toLowerCase().includes(lowerSearchText))
      );
    }

    // 2. Filtrar por estado
    if (statusFilter && statusFilter !== 'Todos') {
      tempAppointments = tempAppointments.filter(app => app.status === statusFilter);
    }

    // 3. Filtrar por especialidad
    if (specialtyFilter && specialtyFilter !== 'Todas') {
      tempAppointments = tempAppointments.filter(app => app.specialty === specialtyFilter);
    }

    // 4. Filtrar por rango de fechas
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Establecer la hora al inicio del día

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Establecer la hora al final del día

      tempAppointments = tempAppointments.filter(app => {
        const appDate = new Date(app.appointmentDate);
        appDate.setHours(0, 0, 0, 0); // Establecer la hora al inicio del día para una comparación justa

        return appDate >= start && appDate <= end;
      });
    }

    this.filteredAppointments = tempAppointments;
  }

  clearFilters(): void {
    this.searchForm.reset({
      searchText: '',
      statusFilter: '',
      specialtyFilter: '',
      startDate: null,
      endDate: null
    });
    // Asegurarse de que los valores de los selectores vuelvan a su estado inicial si es necesario
    // Opcional: Re-cargar todas las citas si reset no dispara valueChanges correctamente.
    this.applyFilters(); // Aplica los filtros después de resetear para mostrar todas las citas
  }
}