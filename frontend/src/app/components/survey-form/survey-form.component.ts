import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurveyService } from '../../services/survey.service';
import { EligibilityResult } from '../../models/eligibilty-result.model';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.css'],
})
export class SurveyFormComponent {
  // Survey data to send to backend
  surveyData: any = {};
  
  // UI state
  currentStep: number | string = 0;
  currentQuestion: string = '';
  questionType: string = '';
  options: string[] = [];
  hasPlacementOption: boolean = false;
  
  // Dynamic form fields
  startYearOptions: number[] = [];
  graduationYearOptions: number[] = [];
  
  // UI state
  loading: boolean = false;
  error: string = '';
  finalMessage: string = '';
  
  // Results
  eligibilityResult: EligibilityResult | null = null;
  
  constructor(private surveyService: SurveyService) {
    this.generateYearArrays();
  }
  
  generateYearArrays() {
    const currentYear = new Date().getFullYear();
    this.startYearOptions = Array.from({ length: 7 }, (_, i) => currentYear - i).sort((a, b) => a - b);
    this.graduationYearOptions = Array.from({ length: 8 }, (_, i) => currentYear + i);
  }
  
  startSurvey() {
    this.currentStep = 0; // Start at step 0
    this.getNextQuestion(); // This will move to step 1
  }
  
  getNextQuestion() {
    this.loading = true;
    this.error = '';
    
    // Prepare data to send to backend
    const requestData = {
      current_step: this.currentStep,
      ...this.surveyData
    };
    
    console.log('Requesting next question with data:', requestData);
    
    this.surveyService.getNextStep(requestData).subscribe({
      next: (response) => {
        console.log('Received response:', response);
        this.loading = false;
        
        if (response.error) {
          this.error = response.error;
          return;
        }
        
        this.currentStep = response.next_step;
        
        if (response.next_step === 'final') {
          this.finalMessage = response.message || 'Thank you for completing the survey!';
          return;
        }
        
        this.currentQuestion = response.question;
        this.questionType = response.type;
        
        if (response.type === 'select') {
          this.options = response.options || [];
        }
        
        if (response.type === 'year_selection') {
          this.hasPlacementOption = response.has_placement === true;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error loading question: ' + (err.message || 'Unknown error');
        console.error('API error:', err);
      }
    });
  }
  
  nextStep() {
    // Initialize previous_steps array if it doesn't exist
    if (!this.surveyData.previous_steps) {
      this.surveyData.previous_steps = [];
    }
    
    // Only save the step if we're on a valid step (not 0 or undefined)
    if (this.currentStep !== 0 && this.currentStep !== undefined) {
      // Save the current step before moving to the next one
      this.surveyData.previous_steps.push(this.currentStep);
      console.log('Updated step history:', this.surveyData.previous_steps);
    }
    
    console.log('Moving to next step from', this.currentStep);
    this.getNextQuestion();
  }
  
  prevStep() {
    console.log('Moving back from step', this.currentStep);
    console.log('Current step history:', this.surveyData.previous_steps);
    
    // Handle the case when we don't have previous steps information
    if (!this.surveyData.previous_steps || this.surveyData.previous_steps.length === 0) {
      console.log('No previous steps recorded, defaulting to step 1');
      // If we don't have a previous steps history, just go back to step 1
      if (this.currentStep !== 1) {
        this.currentStep = 1;
        this.getNextQuestion();
      }
      return;
    }
    
    // Instead of popping to remove the current step,
    // we want the previous step, which should be the last entry in the array
    const previousStep = this.surveyData.previous_steps.pop();
    console.log(`Going back to step ${previousStep}`);
    
    // Send request to backend with the previous step
    this.loading = true;
    this.error = '';
    
    const requestData = {
      previous_step: previousStep, // Add this to explicitly tell the backend which step to go to
      current_step: this.currentStep,
      is_previous: true,
      ...this.surveyData
    };
    
    console.log('Requesting previous step with data:', requestData);
    
    this.surveyService.getNextStep(requestData).subscribe({
      next: (response) => {
        console.log('Received previous step response:', response);
        this.loading = false;
        
        if (response.error) {
          this.error = response.error;
          return;
        }
        
        // Update current step to the previous step
        this.currentStep = response.next_step;
        this.currentQuestion = response.question;
        this.questionType = response.type;
        
        if (response.type === 'select') {
          this.options = response.options || [];
        }
        
        if (response.type === 'year_selection') {
          this.hasPlacementOption = response.has_placement === true;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error loading previous question: ' + (err.message || 'Unknown error');
        console.error('API error:', err);
      }
    });
  }
  
  submitSurvey() {
    this.loading = true;
    this.error = '';
    
    // Calculate year_of_study if needed
    if (this.surveyData.start_year && !this.surveyData.year_of_study) {
      const currentYear = new Date().getFullYear();
      this.surveyData.year_of_study = currentYear - this.surveyData.start_year + 1;
    }
    
    // Set graduated flag based on education_stage
    this.surveyData.graduated = this.surveyData.education_stage === 'graduate';
    
    console.log('Submitting survey data:', this.surveyData);
    
    this.surveyService.submitSurvey(this.surveyData).subscribe({
      next: (result) => {
        console.log('Survey result:', result);
        this.loading = false;
        this.eligibilityResult = result;
        
        // If result is empty or missing expected fields
        if (!result || !result.primary_tab) {
          this.error = 'No recommendations received. The server may have encountered an error processing your data.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error submitting survey: ' + (err.message || 'Unknown error');
        console.error('API error:', err);
        console.error('Error details:', err.error);
      }
    });
  }
  
  // Helper methods for templates
  isIntroStep(): boolean {
    return this.currentStep === 0;
  }
  
  isValueValid(value: any): boolean {
    if (this.questionType === 'select') {
      return !!value;
    }
    if (this.questionType === 'boolean') {
      return value === true || value === false;
    }
    if (this.questionType === 'year_selection') {
      return !!this.surveyData.start_year && !!this.surveyData.graduation_year;
    }
    return true;
  }
  
  updateFormValue(field: string, value: any) {
    this.surveyData[field] = value;
    console.log(`Updated ${field} to ${value}`);
  }
  
  retry() {
    this.getNextQuestion();
  }
  
  isStringStep(): boolean {
    return typeof this.currentStep === 'string';
  }

  isNumberStep(): boolean {
    return typeof this.currentStep === 'number';
  }
}