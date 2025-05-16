// For interacting with Flask APIimport { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SurveyResponse } from '../models/survey-response.model';
import { EligibilityResult } from '../models/eligibilty-result.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private apiUrl = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  getNextStep(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/survey/step`, data);
  }

  submitSurvey(data: any): Observable<EligibilityResult> {
    return this.http.post<EligibilityResult>(`${this.apiUrl}/survey/submit`, data);
  }
}
