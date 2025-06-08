import { Routes } from '@angular/router';
import { DoctorListComponent } from './features/doctors/doctor-list/doctor-list.component';
import { AppointmentHistoryComponent } from './features/appointments/components/appointment-history/appointment-history.component';
import { CalendarComponent } from './features/calendar/components/calendar/calendar.component';

// Importa el nuevo AppointmentFormComponent
import { AppointmentFormComponent } from './features/appointments/components/appointment-form/appointment-form.component';

export const routes: Routes = [
  {
    path: 'doctors',
    loadComponent: () => import('./features/doctors/doctor-list/doctor-list.component')
                           .then(m => m.DoctorListComponent)
  },
  {
    path: 'appointments', // Esta ruta ya existía para el historial
    // Podemos hacer que el path 'appointments' cargue el historial,
    // y para el formulario, usar un sub-path como 'appointments/new'
    loadComponent: () => import('./features/appointments/components/appointment-history/appointment-history.component')
                           .then(m => m.AppointmentHistoryComponent)
  },
  {
    path: 'appointments/new', // Nueva ruta para el formulario de citas
    loadComponent: () => import('./features/appointments/components/appointment-form/appointment-form.component')
                           .then(m => m.AppointmentFormComponent)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./features/calendar/components/calendar/calendar.component')
                           .then(m => m.CalendarComponent)
  },
  {
    path: '',
    redirectTo: 'doctors',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'doctors'
  }
];