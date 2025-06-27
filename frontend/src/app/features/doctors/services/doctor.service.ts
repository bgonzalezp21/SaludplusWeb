import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Importamos Observable y 'of' para crear un observable a partir de datos estáticos

// Interfaz para definir la estructura de un médico
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  // Puedes añadir más campos si los necesitas, ej: phone, email, etc.
}

@Injectable({
  providedIn: 'root' // Esto hace que el servicio sea un 'singleton' y esté disponible en toda la aplicación
})
export class DoctorService {

  private mockDoctors: Doctor[] = [
    { id: 1, name: 'Dr. Juan Pérez', specialty: 'Cardiología' },
    { id: 2, name: 'Dra. Ana García', specialty: 'Pediatría' },
    { id: 3, name: 'Dr. Luis Rodríguez', specialty: 'Dermatología' },
    { id: 4, name: 'Dra. Marta López', specialty: 'Oftalmología' },
    { id: 5, name: 'Dr. Carlos Sánchez', specialty: 'Neurología' },
    { id: 6, name: 'Dra. Laura Fernández', specialty: 'Ginecología' },
  ];

  constructor() { }

  /**
   * Simula la obtención de la lista de médicos desde una API.
   * Retorna un Observable para simular asincronía.
   */
  getDoctors(): Observable<Doctor[]> {
    // 'of' crea un Observable que emite los valores proporcionados y luego completa.
    // Esto simula una llamada HTTP asíncrona.
    return of(this.mockDoctors);
  }
}