import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurveyResponse } from '../../models/survey-response.model';
import { SurveyService } from '../../services/survey.service';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.css'
})
export class SurveyFormComponent {
  survey: SurveyResponse = {
    education_stage: '',
    year_of_study: undefined,
    graduation_year: undefined,
    has_placement: false,
    has_grad_offer: false,
    has_experience: false,
    graduated: false
  };
  
  constructor(private surveyService: SurveyService) {}
  
  onSubmit() {
  console.log('Data being sent to API:', JSON.stringify(this.survey, null, 2));
  
  this.surveyService.submitSurvey(this.survey).subscribe(
    result => {
      console.log('Survey result:', result);
      // Handle the result here
    },
    error => {
      console.error('Error submitting survey:', error);
    }
  );
  }
}