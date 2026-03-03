import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ColumnService {

  private apiUrl = 'http://localhost:3000/columns';

  constructor(private http: HttpClient) {}

  getColumns(user: string) {
    return this.http.get<any[]>(`${this.apiUrl}?user=${user}`);
  }

  createColumn(column: any) {
    return this.http.post(this.apiUrl, column);
  }

  deleteColumn(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateColumn(id: number, column: any) {
    return this.http.put(`${this.apiUrl}/${id}`, column);
  }
}