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
  private apiUrl = 'http://127.0.0.1:5000/api/survey';

  constructor(private http: HttpClient) {}

  submitSurvey(data: SurveyResponse): Observable<EligibilityResult> {
    return this.http.post<EligibilityResult>(this.apiUrl, data);
  }
}
