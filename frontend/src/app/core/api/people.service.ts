import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DashboardDto, PersonDto, RelationType } from '../../shared/models/person';

export interface PersonPayload {
  name: string;
  relation: RelationType;
  birthDate: string;
  notes?: string | null;
}

@Injectable({ providedIn: 'root' })
export class PeopleApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api`;

  list(search?: string, relation?: RelationType | null, sort = 'days') {
    let params = new HttpParams().set('sort', sort);
    if (search) params = params.set('search', search);
    if (relation != null) params = params.set('relation', relation);
    return this.http.get<PersonDto[]>(`${this.base}/people`, { params, withCredentials: true });
  }

  get(id: string) {
    return this.http.get<PersonDto>(`${this.base}/people/${id}`, { withCredentials: true });
  }

  create(body: PersonPayload) {
    return this.http.post<PersonDto>(`${this.base}/people`, body, { withCredentials: true });
  }

  update(id: string, body: PersonPayload) {
    return this.http.put<PersonDto>(`${this.base}/people/${id}`, body, { withCredentials: true });
  }

  remove(id: string) {
    return this.http.delete<void>(`${this.base}/people/${id}`, { withCredentials: true });
  }

  dashboard() {
    return this.http.get<DashboardDto>(`${this.base}/dashboard`, { withCredentials: true });
  }
}
