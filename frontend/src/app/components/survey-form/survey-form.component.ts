type CareerPathKey = 'Summer Internships' | 'Spring Weeks' | 'Insight Programmes' | 'Off-Cycle Internships' | 
                     'Industrial Placements' | 'Graduate Schemes' | 'Pre-University' | 'Vacation Schemes' | 'Training Contracts' | 
                     'First Year Schemes' | 'Non-Law Internships'

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurveyProcessorService } from '../../services/survey-processor.service';
import { EligibilityResult } from '../../models/eligibilty-result.model';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.css'],
})
export class SurveyFormComponent {
  // Survey data for local processing
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
  
  constructor(private surveyProcessor: SurveyProcessorService) {
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
    
    // Use local processor instead of API call
    const requestData = {
      current_step: this.currentStep,
      ...this.surveyData
    };
    
    console.log('Processing next question with data:', requestData);
    
    try {
      const response = this.surveyProcessor.getNextStep(requestData);
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
      
      this.currentQuestion = response.question || '';
      this.questionType = response.type || '';
      
      if (response.type === 'select') {
        this.options = response.options || [];
        this.surveyData.education_stage = '';
      }

      if (response.type == 'select_sector') {
        this.options = response.options || [];
        this.surveyData.sector = '';
      }
      
      if (response.type === 'year_selection') {
        this.hasPlacementOption = response.has_placement === true;
        this.surveyData.start_year = '';
        this.surveyData.graduation_year = '';
      }
    } catch (err) {
      this.loading = false;
      this.error = 'Error processing question: ' + (err || 'Unknown error');
      console.error('Processing error:', err);
    }
  }
  
  nextStep() {
    // Validate before proceeding
    if (!this.isValueValid()) {
      // Set appropriate error message based on question type
      if (this.questionType === 'select') {
        this.error = 'Please select an option to continue';
      } else if (this.questionType === 'select_sector') {
        this.error = 'Please select an option to continue'
      } else if (this.questionType === 'boolean') {
        this.error = 'Please select Yes or No to continue';
      } else if (this.questionType === 'year_selection') {
        this.error = 'Please select both start and graduation years';
      } else {
        this.error = 'Please complete this question to continue';
      }
      return;
    }

    // Clear any previous errors
    this.error = '';
    
    // Save current step before moving to the next one
    this.surveyData.previous_step = this.currentStep;
    
    console.log('Moving to next step from', this.currentStep);
    this.getNextQuestion();
  }
  
  prevStep() {
    console.log('Moving back from step', this.currentStep);
    
    this.loading = true;
    this.error = '';
    
    const requestData = {
      current_step: this.currentStep,
      is_previous: true,
      ...this.surveyData
    };
    
    console.log('Processing previous step with data:', requestData);
    
    try {
      const response = this.surveyProcessor.getNextStep(requestData);
      console.log('Received previous step response:', response);
      
      this.loading = false;
      
      if (response.error) {
        this.error = response.error;
        return;
      }
      
      this.currentStep = response.next_step;
      this.currentQuestion = response.question || '';
      this.questionType = response.type || '';
      
      if (response.type === 'select') {
        this.options = response.options || [];
      }

      if (response.type === 'select_sector') {
        this.options = response.options || [];
      }
      
      if (response.type === 'year_selection') {
        this.hasPlacementOption = response.has_placement === true;
      }
    } catch (err) {
      this.loading = false;
      this.error = 'Error processing previous question: ' + (err || 'Unknown error');
      console.error('Processing error:', err);
    }
  }

  resetSurvey() {
    // Reset all form data
    this.surveyData = {};
    
    // Clear any results
    this.eligibilityResult = null;
    this.error = '';

    // Restart survey
    this.startSurvey();
    console.log('Survet reset and restarted');

  }
  
  submitSurvey() {
    this.loading = true;
    this.error = '';
    
    // Set graduated flag based on education_stage
    this.surveyData.graduated = this.surveyData.education_stage === 'graduate';
    
    console.log('Processing survey data locally:', this.surveyData);
    
    try {
      // Calculate year of study if needed
      if (this.surveyData.education_stage === 'university') {
        this.surveyData.year_of_study = this.surveyProcessor.calculateYearOfStudy(this.surveyData);
      }

      
      // Process eligibility locally
      const result = this.surveyProcessor.processEligibility(this.surveyData);
      
      console.log('Survey result:', result);
      this.loading = false;
      this.eligibilityResult = result;
      
      if (!result || !result.primary_tab) {
        this.error = 'No recommendations could be generated based on your responses.';
      } else {
        setTimeout(() => {
          const resultElement = document.querySelector('.result-container');
          if (resultElement) {
            resultElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (err) {
      this.loading = false;
      this.error = 'Error processing survey: ' + (err || 'Unknown error');
      console.error('Processing error:', err);
    }
  }
  
  // Helper methods for templates
  isIntroStep(): boolean {
    return this.currentStep === 0;
  }
  
  isValueValid(): boolean {
    // Always validate based on current step/question type
    if (this.questionType === 'select') {
      return !!this.surveyData.education_stage;
    }

    if (this.questionType === 'select_sector') {
      return !!this.surveyData.sector
    }
    
    if (this.questionType === 'boolean') {
      // Check the appropriate boolean field based on current step
      if (this.currentStep === 4) {
        return this.surveyData.has_spring_weeks === true || this.surveyData.has_spring_weeks === false;
      }
      if (this.currentStep === 5) {
        return this.surveyData.converted_spring_to_internship === true || 
               this.surveyData.converted_spring_to_internship === false;
      }
      if (this.currentStep === 'internship_experience') {
        return this.surveyData.has_experience === true || this.surveyData.has_experience === false;
      }
      if (this.currentStep === 'grad_offer') {
        return this.surveyData.has_grad_offer === true || this.surveyData.has_grad_offer === false;
      }
      return false; // If we can't determine which boolean field to check
    }
    
    if (this.questionType === 'year_selection') {
      return !!this.surveyData.start_year && !!this.surveyData.graduation_year;
    }
    
    return true; // Default case
  }
  
  updateFormValue(field: string, value: any) {
    this.surveyData[field] = value;
    console.log(`Updated ${field} to ${value}`);
  }
  
  isStringStep(): boolean {
    return typeof this.currentStep === 'string';
  }

  isNumberStep(): boolean {
    return typeof this.currentStep === 'number';
  }

  // Add as a class property
  careerPathDescriptions: Record<CareerPathKey, string> = {
    "Summer Internships": "Summer internships are 8-10 week paid internship programmes lasting from June to August. These are typically intended for penultimate-year students and normally lead to a graduate offer at the end of the internship, contingent on good performance. Summer internships are the most effective and reliable route to receiving a full-time offer and are treated as a prerequisite for applying to off-cycle internships and graduate programmes. Summer internship programmes receive the most applicants of any tab, but they also have the highest number of available offers.",
    
    "Spring Weeks": "Spring weeks are 1-5 day insight programmes conducted during Spring holidays. These are typically intended for students graduating in 2 years and often lead to a summer internship offer at the end of the spring week, contingent on strong performance or post-spring week interview. Spring weeks are an excellent route into receiving a summer internship offer more than 1 year in advance, and are less dependent on previous relevant experience. Even if you don't convert a spring week, candidates with spring weeks on their resume receive almost twice as many summer internship interviews the following year.",
    
    "Insight Programmes": "Insight programmes are 1-5 day immersive experiences conducted during university holidays, designed to give students exposure to different areas of technology. These are typically intended for students graduating in 2 years and often lead to a summer internship offer at the end of the programme, contingent on strong performance. Insight programmes are an excellent route into receiving a summer internship offer more than 1 year in advance, and are less dependent on previous technical experience. Tech companies value curiosity and potential over existing skills, making these programmes ideal for exploring different technology career paths.",
    
    "Off-Cycle Internships": "Off-cycle internships are 3-6 month paid internship programmes running at various times of the year. Due to the long-term nature of these programmes, they are typically intended for recent graduates. However, any student is eligible if you are able to take time off university or complete the internship alongside your studies. Off-cycle internships open far more sporadically as opposed to summer internships which open at the same time every year. These often lead to a graduate offer at the end of the internship, contingent of good performance - however many off-cycle internships are non-convertible.",
    
    "Industrial Placements": "Industrial placements are 12-month paid internship programmes, designed for students who have a year in industry as part of their degree. These programmes are far less competitive than summer internships because the pool of applicants is notably smaller, and they normally lead to a graduate offer at the end of the placement, contingent on good performance. We strongly advise any eligible candidates to apply for these available positions because they serve as a less competitive route to a full-time offer and are great for your resume if you choose to apply elsewhere.",
    
    "Graduate Schemes": "Graduate schemes are full-time positions designed for recent graduates. Within the competitive areas of finance (investment banking, private equity, sales & trading etc), applying to graduate schemes is unrealistically competitive unless you have numerous previous internships. Graduate schemes at less competitive companies (e.g. smaller banks, big 4) or less competitive roles (e.g. risk, audit) are more attainable, but we generally advise against applying for graduate schemes at large banks for their competitive roles.",
    
    "Pre-University": "The pre-university tab details every paid internship, work experience and apprenticeship programme available for high school students. The paid internships are an excellent way to build your resume as a school student, and the work experience programmes may sometimes convert to a spring week offer for when you begin university. Apprenticeships and degree apprenticeships are favourable options from a financial perspective, but often limit your ability to apply elsewhere and may pigeonhole you if you select a less desirable role.",

    "Vacation Schemes": "Vacation schemes are 1-3 week paid internship programmes typically held during the Easter or summer holidays. These are primarily aimed at penultimate-year students and often lead to a training contract offer at the end of the scheme, subject to strong performance. Vacation schemes are the most effective and reliable route to securing a training contract and are often considered a prerequisite for applying directly to graduate programmes. Vacation schemes receive a high volume of applications among law opportunities, but they also offer the largest number of training contract outcomes.",

    "Training Contracts": "Training contracts are two-year paid solicitor training programmes that begin after the completion of any required legal studies (such as the GDL or SQE). These are aimed at final-year students and graduates, and serve as the final step before qualification as a solicitor. Securing a training contract is essential to becoming a solicitor in England and Wales, and most firms recruit up to two years in advance. While highly competitive, training contracts represent the definitive route into the legal profession and are often offered to those who have previously completed a vacation scheme.",

    "First Year Schemes": "First year schemes are short insight programmes, typically lasting 1–5 days and held during the Easter holidays. These are designed specifically for first-year law students or second-year students on a four-year course and provide early exposure to the legal profession. While they do not always lead directly to training contracts, they are a valuable stepping stone to vacation schemes and help build relationships with firms early in the recruitment process. First year schemes are highly competitive due to limited spaces but offer a strong advantage in future applications.",

    "Non-Law Internships": "Non-law internships are short-term work experiences, typically lasting a few weeks to a few months, in industries such as consulting, finance, government, or policy. These are open to students from all backgrounds and are particularly useful for law students seeking to build commercial awareness and transferable skills. While they do not lead directly to training contracts, they strengthen future law firm applications and demonstrate a broader understanding of the legal industry's commercial context. Non-law internships are generally less competitive than vacation schemes and offer valuable experience for those exploring a career in law from different angles.",
  };

  getCareerDescription(path: string): string {
    // Type assertion to treat path as a valid key
    const key = path as CareerPathKey;
    return this.careerPathDescriptions[key] || 
      `Description for ${path} is not available`;
  }
}