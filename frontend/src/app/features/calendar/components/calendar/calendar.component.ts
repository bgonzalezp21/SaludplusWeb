import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para directivas Angular estándar
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Necesario para el datepicker
import { Appointment, AppointmentService } from '../../../appointments/services/appointment.service';
import { map } from 'rxjs/operators'; // Para transformar datos de Observable
import { MatSnackBar } from '@angular/material/snack-bar'; // Para alertas visuales (futuro)
import { MatListModule } from '@angular/material/list'; // Para mostrar detalles de citas en el día seleccionado

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule, // Añadir MatListModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

  appointments: Appointment[] = [];
  selectedDate: Date | null = null; // Para la fecha seleccionada en el calendario
  appointmentsOnSelectedDate: Appointment[] = []; // Citas para la fecha seleccionada

  // Función para personalizar la apariencia de las fechas en el calendario
  dateClass = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const hasAppointment = this.appointments.some(
      (app) => app.appointmentDate === dateString && app.status === 'Confirmada'
    );
    return hasAppointment ? 'has-appointment' : '';
  };

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar // Inyecta MatSnackBar para futuras alertas
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe(data => {
      this.appointments = data;
      // Si ya hay una fecha seleccionada, actualiza las citas para esa fecha
      if (this.selectedDate) {
        this.onDateSelected(this.selectedDate);
      }
      this.checkUpcomingAppointments(); // Llama a la función de alertas al cargar citas
    });
  }

  onDateSelected(date: Date | null): void {
    this.selectedDate = date;
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      this.appointmentsOnSelectedDate = this.appointments.filter(
        (app) => app.appointmentDate === dateString && app.status === 'Confirmada'
      ).sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime)); // Ordenar por hora
    } else {
      this.appointmentsOnSelectedDate = [];
    }
  }

  // --- Funcionalidad de Alerta Visual para Citas Próximas  ---
  checkUpcomingAppointments(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const upcomingAppointments = this.appointments.filter(app => {
      const appDate = new Date(app.appointmentDate + 'T' + app.appointmentTime + ':00'); // Combina fecha y hora
      // Comprueba si la cita es confirmada y en el rango de "próximas" (ej: dentro de las próximas 24 horas)
      return app.status === 'Confirmada' && appDate > now && appDate <= tomorrow;
    });

    if (upcomingAppointments.length > 0) {
      let message = `Tienes ${upcomingAppointments.length} cita(s) próxima(s) en las próximas 24 horas:`;
      upcomingAppointments.forEach(app => {
        message += `\n- ${app.patientName} con ${app.doctorName} el ${app.appointmentDate} a las ${app.appointmentTime}`;
      });
      this.snackBar.open(message, 'Ver', {
        duration: 10000, // Duración más larga para que se vea bien
        panelClass: ['snackbar-info'] // Estilo de información (asegúrate de definirlo en styles.scss)
      }).onAction().subscribe(() => {
        // Opcional: Navegar a la sección de citas o al día en el calendario
        console.log('Alerta de citas próximas vista.');
        // Aquí podrías agregar lógica para, por ejemplo, navegar al historial de citas
        // o a la fecha en el calendario.
      });
    }
  }

  // --- Funcionalidad de Cálculo de Citas por Semana y Mes  ---
  getAppointmentsCountByPeriod(): { weekly: number, monthly: number } {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Domingo de la semana actual
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado de la semana actual
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Último día del mes actual
    endOfMonth.setHours(23, 59, 59, 999);

    let weeklyCount = 0;
    let monthlyCount = 0;

    this.appointments.forEach(app => {
      const appDate = new Date(app.appointmentDate);
      appDate.setHours(0, 0, 0, 0); // Normalizar hora para la comparación

      if (app.status === 'Confirmada') { // Solo contar citas confirmadas
        if (appDate >= startOfWeek && appDate <= endOfWeek) {
          weeklyCount++;
        }
        if (appDate >= startOfMonth && appDate <= endOfMonth) {
          monthlyCount++;
        }
      }
    });

    return { weekly: weeklyCount, monthly: monthlyCount };
  }
}