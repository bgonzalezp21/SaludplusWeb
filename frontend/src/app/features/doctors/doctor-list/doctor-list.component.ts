import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

// Importa el DoctorService y la interfaz Doctor
import { Doctor, DoctorService } from '../services/doctor.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.css'
})
export class DoctorListComponent implements OnInit {

  doctors: Doctor[] = [];
  displayedColumns: string[] = ['name', 'specialty'];

  // Inyecta DoctorService en el constructor
  constructor(private doctorService: DoctorService) { }

  ngOnInit(): void {
    // Suscríbete al Observable para obtener los datos de los médicos
    this.doctorService.getDoctors().subscribe(data => {
      this.doctors = data;
    });
  }
}