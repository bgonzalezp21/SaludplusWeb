import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Importa MatSnackBar y MatSnackBarModule

import { Doctor, DoctorService } from '../../../doctors/services/doctor.service';
import { Appointment, AppointmentService } from '../../services/appointment.service'; // Importa Appointment y AppointmentService

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule 
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;
  doctors: Doctor[] = [];
  availableHours: string[] = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
  minDate: Date; // Para restringir la fecha de la cita a partir de hoy

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService, 
    private snackBar: MatSnackBar 
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.appointmentForm = new FormGroup({
      patientName: new FormControl('', Validators.required),
      doctorId: new FormControl(null, Validators.required),
      appointmentDate: new FormControl(null, Validators.required),
      appointmentTime: new FormControl('', Validators.required),
    });

    this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const selectedDoctor = this.doctors.find(d => d.id === formValue.doctorId);

      // Asegúrate de que appointmentDate es un objeto Date antes de formatear
      const appointmentDateObj = formValue.appointmentDate instanceof Date
                                 ? formValue.appointmentDate
                                 : new Date(formValue.appointmentDate);

      // Prepara el objeto de la cita para el servicio
      const newAppointmentData = {
        patientName: formValue.patientName,
        doctorId: formValue.doctorId,
        // Formatear la fecha a 'YYYY-MM-DD' para consistencia con el servicio mock
        appointmentDate: appointmentDateObj.toISOString().split('T')[0],
        appointmentTime: formValue.appointmentTime,
        // doctorName y specialty se pueden añadir aquí si quieres pasarlos al servicio mock,
        // o el servicio mock puede resolverlos internamente si tiene acceso a DoctorService
        doctorName: selectedDoctor ? selectedDoctor.name : undefined,
        specialty: selectedDoctor ? selectedDoctor.specialty : undefined,
      };

      this.appointmentService.addAppointment(newAppointmentData).subscribe({
        next: (appointment) => {
          this.snackBar.open('Cita agendada con éxito para ' + appointment.patientName, 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-success'] // Clase CSS para estilizar el snackbar (opcional)
          });
          this.appointmentForm.reset();
          // Opcional: Reiniciar el estado de validación si es necesario
          Object.keys(this.appointmentForm.controls).forEach(key => {
            this.appointmentForm.get(key)?.setErrors(null);
          });
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Error al agendar la cita.', 'Cerrar', {
            duration: 5000,
            panelClass: ['snackbar-error'] // Clase CSS para estilizar el snackbar (opcional)
          });
          console.error('Error al agendar cita:', error);
        }
      });
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snackbar-warning']
      });
      this.appointmentForm.markAllAsTouched();
    }
  }
}