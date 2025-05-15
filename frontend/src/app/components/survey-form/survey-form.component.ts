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
    start_year: undefined,    // Add this field
    graduation_year: undefined,
    has_placement: false,
    has_grad_offer: false,
    has_experience: false,
    graduated: false
  };
  
  // Start at step 0 (Get Started screen)
  currentStep = 0;
  totalSteps = 1; 
  startYearOptions: number[] = [];
  graduationYearOptions: number[] = [];
  
  constructor(private surveyService: SurveyService) {
    this.generateYearArrays();
  }
  
  startSurvey() {
    this.currentStep = 1;
    this.calculateTotalSteps();
  }
  
  nextStep() {
    this.calculateTotalSteps();
    
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }
  
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  calculateTotalSteps() {
    // Base case - always at least 1 step
    this.totalSteps = 1;
    
    if (this.survey.education_stage === 'university') {
      this.totalSteps = 2; // Add year of study step
      
      if (this.survey.year_of_study) {
        this.totalSteps = 3; // Add graduation year step
        
        if (this.survey.graduation_year) {
          // Other steps based on responses...
          if (this.survey.year_of_study === 4) {
            this.totalSteps = 4; // Add grad offer question
            
            if (this.survey.has_grad_offer === false) {
              this.totalSteps = 5; // Add experience question
            }
          }
        }
      }
    }
    // Rest of your logic...
  }
  
  updateYearOfStudy() {
    if (this.survey.start_year) {
      const currentYear = new Date().getFullYear();
      this.survey.year_of_study = currentYear - this.survey.start_year + 1;
      
      // If both start and graduation year are set, validate consistency
      if (this.survey.graduation_year && this.survey.start_year) {
        const totalYears = this.survey.graduation_year - this.survey.start_year;
        if (totalYears < 1 || totalYears > 7) {
          alert('Please check your start and graduation years. The duration seems unusual.');
        }
      }
    }
  }
  
  generateYearArrays() {
    const currentYear = new Date().getFullYear();
    
    // Start year options: 6 years back through current year
    this.startYearOptions = [];
    for (let i = currentYear; i >= currentYear - 6; i--) {
      this.startYearOptions.push(i);
    }
    this.startYearOptions.sort((a, b) => a - b); // Sort ascending
    
    // Graduation year options: current year through 7 years ahead
    this.graduationYearOptions = [];
    for (let i = currentYear; i <= currentYear + 7; i++) {
      this.graduationYearOptions.push(i);
    }
  }
  
  onSubmit() {
    console.log('Submitting data:', JSON.stringify(this.survey, null, 2));
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