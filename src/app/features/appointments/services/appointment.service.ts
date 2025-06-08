import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs'; // throwError para simular errores
import { Doctor } from '../../doctors/services/doctor.service'; // Importamos Doctor para referencia

// Interfaz para definir la estructura de una cita
export interface Appointment {
  id: number;
  patientName: string;
  doctorId: number;
  doctorName?: string; // Opcional, para facilitar la visualización
  specialty?: string; // Opcional
  appointmentDate: string; // Usaremos formato 'YYYY-MM-DD' para simplificar la comparación
  appointmentTime: string; // Usaremos formato 'HH:MM'
  status: 'Confirmada' | 'Realizada' | 'Cancelada';
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private appointments: Appointment[] = [
    // Citas de ejemplo para pruebas de historial
    { id: 1, patientName: 'Sofía Díaz', doctorId: 1, doctorName: 'Dr. Juan Pérez', specialty: 'Cardiología', appointmentDate: '2025-06-10', appointmentTime: '09:00', status: 'Confirmada' },
    { id: 2, patientName: 'Pedro Gómez', doctorId: 2, doctorName: 'Dra. Ana García', specialty: 'Pediatría', appointmentDate: '2025-06-10', appointmentTime: '10:00', status: 'Confirmada' },
    { id: 3, patientName: 'Laura Pérez', doctorId: 1, doctorName: 'Dr. Juan Pérez', specialty: 'Cardiología', appointmentDate: '2025-06-05', appointmentTime: '10:00', status: 'Realizada' },
    { id: 4, patientName: 'Diego Torres', doctorId: 3, doctorName: 'Dr. Luis Rodríguez', specialty: 'Dermatología', appointmentDate: '2025-06-08', appointmentTime: '15:00', status: 'Cancelada' },
  ];
  private nextId: number = 5; // Para generar IDs únicos para nuevas citas

  constructor() { }

  /**
   * Simula el registro de una nueva cita, validando la sobreposición.
   * @param newAppointment La cita a registrar (sin id ni status inicial).
   * @returns Observable de la cita registrada o un error si hay sobreposición.
   */
  addAppointment(newAppointment: Omit<Appointment, 'id' | 'status'>): Observable<Appointment> {
    // Formatear la fecha para asegurar consistencia en la comparación
    const appointmentDateFormatted = new Date(newAppointment.appointmentDate).toISOString().split('T')[0];

    // 1. Validar sobreposición 
    const isOverlap = this.appointments.some(
      (app) =>
        app.doctorId === newAppointment.doctorId &&
        app.appointmentDate === appointmentDateFormatted && // Usar fecha formateada
        app.appointmentTime === newAppointment.appointmentTime &&
        app.status === 'Confirmada' // Solo verificar sobreposición con citas confirmadas
    );

    if (isOverlap) {
      // Si hay sobreposición, retornamos un Observable que emite un error
      return throwError(() => new Error('Ya existe una cita confirmada para este médico en la fecha y hora seleccionadas.'));
    }

    // 2. Si no hay sobreposición, registrar la cita
    const appointmentToSave: Appointment = {
      ...newAppointment,
      id: this.nextId++,
      appointmentDate: appointmentDateFormatted, // Asegurar que la fecha se guarda formateada
      status: 'Confirmada' // Estado inicial al registrar una cita 
    };

    this.appointments.push(appointmentToSave);
    console.log('Cita agregada:', appointmentToSave);
    return of(appointmentToSave); // Retornar la cita agregada como un Observable
  }

  /**
   * Obtiene el historial de todas las citas.
   */
  getAppointments(): Observable<Appointment[]> {
    return of(this.appointments);
  }

  // Puedes añadir más métodos como getAppointmentById, updateAppointmentStatus, etc.
}