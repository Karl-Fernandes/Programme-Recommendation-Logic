import { Injectable } from '@angular/core';
import { EDUCATION_STAGES, STEP_TYPES, EducationStage, StepType, COMMENTARY_TEXTS, SECTORS } from '../models/survey-constants';
import { EligibilityResult } from '../models/eligibilty-result.model';

export interface SurveyStepResponse {
  next_step: StepType;
  question?: string;
  type?: string;
  options?: string[];
  has_placement?: boolean;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyProcessorService {

  getNextStep(surveyData: any): SurveyStepResponse {
    const currentStep = surveyData.current_step;
    const isPrevious = surveyData.is_previous;

    try {
      if (isPrevious) {
        return this.getPreviousStep(currentStep, surveyData);
      }

      switch (currentStep) {
        case STEP_TYPES.WELCOME:
          return {
            next_step: STEP_TYPES.SECTOR,
            question: "Which sector are you interested in?",
            type: "select_sector",
            options: [
              SECTORS.FINANCE,
              SECTORS.TECH,
              SECTORS.LAW
            ]
          };

        case STEP_TYPES.SECTOR:
          return this.handleSector(surveyData);

        case STEP_TYPES.EDUCATION_STAGE:
          return this.handleEducationStageStep(surveyData);

        case STEP_TYPES.UNIVERSITY_TIMELINE:
          return this.handleUniversityTimelineStep(surveyData);

        case STEP_TYPES.SPRING_WEEKS:
            return this.handleSpringWeeks(surveyData);

        case STEP_TYPES.SPRING_CONVERSION:
          return this.handleSpringConversionStep(surveyData);

        case STEP_TYPES.INTERNSHIP_EXPERIENCE:
          return this.handleInternshipExperience(surveyData);

        case STEP_TYPES.GRAD_OFFER:
          return this.handleGradOffer(surveyData); 

        default:
          return {
            next_step: STEP_TYPES.FINAL,
            message: "Thank you for completing the survey!"
          };
      }
    } catch (error) {
      return {
        next_step: currentStep,
        error: `Error processing step: ${error}`
      };
    }
  }

  private handleSector(surveyData: any): SurveyStepResponse {
    const sector = surveyData.sector;

    if (!sector) {
      return {
        next_step: STEP_TYPES.SECTOR,
        error: "Please select a sector"
      };
    }

    // After sector selection, move to education stage
    return {
      next_step: STEP_TYPES.EDUCATION_STAGE,
      question: "What is your current education stage?",
      type: "select",
      options: [
        EDUCATION_STAGES.HIGH_SCHOOL,
        EDUCATION_STAGES.UNIVERSITY,
        EDUCATION_STAGES.GRADUATE
      ]
    };
  }


  private handleEducationStageStep(surveyData: any): SurveyStepResponse {
    const educationStage = surveyData.education_stage;

    if (educationStage === EDUCATION_STAGES.HIGH_SCHOOL) {
      return {
        next_step: STEP_TYPES.FINAL,
        message: "High school students should check the Pre-University tab for available opportunities."
      };
    }

    if (educationStage === EDUCATION_STAGES.GRADUATE) {
      // Graduates are equivalent to final year+ students, so they can be asked about internship experience
      // They will also be asked about graduate offers since they're already graduated
      return {
        next_step: STEP_TYPES.INTERNSHIP_EXPERIENCE,
        question: "Do you have any internship experience?",
        type: "boolean"
      };
    }

    // University students
    return {
      next_step: STEP_TYPES.UNIVERSITY_TIMELINE,
      question: "Please select your university start year and expected graduation year:",
      type: "year_selection",
      has_placement: true
    };
  }

  private handleUniversityTimelineStep(surveyData: any): SurveyStepResponse {
    const yearOfStudy = this.calculateYearOfStudy(surveyData);
    const yearsUntilGrad = this.calculateYearsUntilGraduation(surveyData);
    
    // If year 1 or more than 2 years until graduation, end survey early
    if (yearOfStudy < 2 || (yearsUntilGrad !== null && yearsUntilGrad <= 0)) {
      return {
        next_step: STEP_TYPES.FINAL,
        message: "Thank you for completing the survey!"
      };
    }

    return {
      next_step: STEP_TYPES.SPRING_WEEKS,
      question: this.getSpringWeeksQuestionText(surveyData.sector),
      type: "boolean"
    };
  }

  private handleSpringWeeks(surveyData: any): SurveyStepResponse {
    const hasSpringWeeks = surveyData.has_spring_weeks;
    const yearOfStudy = this.calculateYearOfStudy(surveyData);

    if (!hasSpringWeeks) {
      // Only ask about internship experience if they're year 2 or later
      if (yearOfStudy >= 2) {
        return {
          next_step: STEP_TYPES.INTERNSHIP_EXPERIENCE,
          question: "Do you have any internship experience?",
          type: "boolean"
        };
      } else {
        // Year 1 students with no spring weeks go straight to final
        return {
          next_step: STEP_TYPES.FINAL,
          message: "Thank you for completing the survey!"
        };
      }
    }

    return {
      next_step: STEP_TYPES.SPRING_CONVERSION,
      question: this.getConversionQuestionText(surveyData.sector),
      type: "boolean"
    };
  }

  private handleSpringConversionStep(surveyData: any): SurveyStepResponse {
    const convertedSpringToInternship = surveyData.converted_spring_to_internship;
    const yearsUntilGrad = this.calculateYearsUntilGraduation(surveyData);
    const yearOfStudy = this.calculateYearOfStudy(surveyData);
    
    // If they converted spring week to internship, set has_experience to true
    if (convertedSpringToInternship) {
      surveyData.has_experience = true;
      
      // Only ask about grad offer if they're in final year (0 years until grad), penultimate year (1 year until grad), or year 4+
      if ((yearsUntilGrad !== null && yearsUntilGrad <= 1) || yearOfStudy >= 4) {
        return {
          next_step: STEP_TYPES.GRAD_OFFER,
          question: "Do you have a graduate offer?",
          type: "boolean"
        };
      } else {
        // If not final year, skip to final step
        return {
          next_step: STEP_TYPES.FINAL,
          message: "Thank you for completing the survey!"
        };
      }
    }
  
    // If they didn't convert, ask about other internship experience (they're year 2+ and had spring weeks)
    return {
      next_step: STEP_TYPES.INTERNSHIP_EXPERIENCE,
      question: " Have you completed any prior relevant Summer Internships or Full-Time work?",
      type: "boolean"
    };
  }

  private handleInternshipExperience(surveyData: any): SurveyStepResponse {
    const internshipExperience = surveyData.has_experience;
    const educationStage = surveyData.education_stage;

    if (internshipExperience) {
        surveyData.has_experience = true;
    }

    // Graduates should always be asked about graduate offers
    if (educationStage === EDUCATION_STAGES.GRADUATE) {
      return {
          next_step: STEP_TYPES.GRAD_OFFER,
          question: "Do you have a graduate offer?",
          type: "boolean"
      };
    }

    // For university students, check if they're in final year or year 4+
    const yearOfStudy = this.calculateYearOfStudy(surveyData);
    const yearsUntilGrad = this.calculateYearsUntilGraduation(surveyData);

    // Ask about grad offer if final year (0 years until grad), penultimate year (1 year until grad), or already year 4+
    if ((yearsUntilGrad !== null && yearsUntilGrad <= 1) || yearOfStudy >= 4) {
      return {
          next_step: STEP_TYPES.GRAD_OFFER,
          question: "Do you have a graduate offer?",
          type: "boolean"
      };
    } else {
      // If not final year, skip to final step
      return {
          next_step: STEP_TYPES.FINAL,
          message: "Thank you for completing the survey!"
      };
    }
  }

  private handleGradOffer(surveyData: any): SurveyStepResponse {
    const gradOffer = surveyData.has_grad_offer;

    if (gradOffer) {
        surveyData.has_grad_offer = true;
    }
    
    return {
        next_step: STEP_TYPES.FINAL,
        message: "Thank you for completing the survey!"
    };
  }

  private getPreviousStep(currentStep: StepType, surveyData: any): SurveyStepResponse {
    switch (currentStep) {
      case STEP_TYPES.SECTOR:
        return {
          next_step: STEP_TYPES.WELCOME,
          message: "Welcome to the Programme Eligibility Survey"
        };

      case STEP_TYPES.EDUCATION_STAGE:
        return {
          next_step: STEP_TYPES.SECTOR,
          question: "Which sector are you interested in?",
          type: "select_sector",
          options: [
            SECTORS.FINANCE,
            SECTORS.TECH,
            SECTORS.LAW
          ]
        };

      case STEP_TYPES.UNIVERSITY_TIMELINE:
        return {
          next_step: STEP_TYPES.EDUCATION_STAGE,
          question: "What is your current education stage?",
          type: "select",
          options: [
            EDUCATION_STAGES.HIGH_SCHOOL,
            EDUCATION_STAGES.UNIVERSITY,
            EDUCATION_STAGES.GRADUATE
          ]
        };
        
      case STEP_TYPES.SPRING_WEEKS:
        return {
          next_step: STEP_TYPES.UNIVERSITY_TIMELINE,
          question: "Please select your university start year and expected graduation year:",
          type: "year_selection",
          has_placement: true
        };

      case STEP_TYPES.SPRING_CONVERSION:
          return {
            next_step: STEP_TYPES.SPRING_WEEKS,
            question: this.getSpringWeeksQuestionText(surveyData.sector),
            type: "boolean"
          };
     
      case STEP_TYPES.INTERNSHIP_EXPERIENCE:
        // Check if they came from spring conversion (they had spring weeks but didn't convert)
        if (surveyData.has_spring_weeks === true && surveyData.converted_spring_to_internship === false) {
          return {
            next_step: STEP_TYPES.SPRING_CONVERSION,
            question: this.getConversionQuestionText(surveyData.sector),
            type: "boolean"
          };
        }
        
        // If they came directly from spring weeks (no spring weeks), go back to spring weeks
        return {
          next_step: STEP_TYPES.SPRING_WEEKS,
          question: this.getSpringWeeksQuestionText(surveyData.sector),
          type: "boolean"
        };

      case STEP_TYPES.GRAD_OFFER:
        // Check if they came from spring conversion (converted = true, skipped internship question)
        if (surveyData.has_spring_weeks === true && surveyData.converted_spring_to_internship === true) {
          return {
            next_step: STEP_TYPES.SPRING_CONVERSION,
            question: this.getConversionQuestionText(surveyData.sector),
            type: "boolean"
          };
        }
        
        // Otherwise they came from internship experience question
        return {
          next_step: STEP_TYPES.INTERNSHIP_EXPERIENCE,
          question: "Have you completed any prior relevant Summer Internships or Full-Time work?",
          type: "boolean"
        };


      default:
        return {
          next_step: STEP_TYPES.SECTOR,
          question: "Which sector are you interested in?",
          type: "select_sector",
          options: [
            SECTORS.FINANCE,
            SECTORS.TECH,
            SECTORS.LAW
          ]
        };
    }
  }

  private getSpringWeeksQuestionText(sector?: string): string {
    if (sector === SECTORS.TECH || sector === SECTORS.LAW) {
      return "Have you attended any Insight Programmes?";
    }
    return "Have you attended any Spring Weeks?";
  }

  private getConversionQuestionText(sector?: string): string {
    if (sector === SECTORS.TECH) {
      return "Did you convert your Insight Programme to a Summer Internship?";
    }
    return "Did you convert your Spring Week to a Summer Internship?";
  }

  private getCurrentAcademicYear(): number {
    const currentDate = new Date();
    // Academic year starts in July, so if we're before July (month < 6), use previous year
    return currentDate.getMonth() < 5 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
  }

  private calculateYearsUntilGraduation(surveyData: any): number | null {
    const graduationYear = parseInt(surveyData.graduation_year);
    if (!graduationYear) return null;
    
    const academicYear = this.getCurrentAcademicYear();
    const yearsUntilGrad = graduationYear - academicYear - 1;
    
    console.log('Academic Year Calculation:', {
      currentDate: new Date(),
      academicYear: academicYear,
      graduationYear: graduationYear,
      yearsUntilGraduation: yearsUntilGrad
    });
    
    return yearsUntilGrad;
  }

  calculateYearOfStudy(surveyData: any): number {
    const startYear = parseInt(surveyData.start_year);
    const graduationYear = parseInt(surveyData.graduation_year);

    if (!startYear || !graduationYear) {
      throw new Error("Start year and graduation year are required");
    }

    const academicYear = this.getCurrentAcademicYear();
    const yearOfStudy = academicYear - startYear + 1;
    const totalDuration = graduationYear - startYear;

    // Handle placement year - similar logic but using academic year calculation
    if (surveyData.has_placement && totalDuration === 4) {
      const yearsSinceStart = academicYear - startYear;
      if (yearsSinceStart === 2) return 3; // Currently on placement (year 3)
      if (yearsSinceStart === 3) return 4; // Final year after placement
    }

    // Ensure year of study is within reasonable bounds
    return Math.min(Math.max(yearOfStudy, 1), totalDuration);
  }

  processEligibility(surveyData: any): EligibilityResult {
    const sector = surveyData.sector;
    const educationStage = surveyData.education_stage;
    const hasSpringWeeks = surveyData.has_spring_weeks;
    const hasExperience = surveyData.has_experience;
    const hasGradOffer = surveyData.has_grad_offer;
    const hasPlacement = surveyData.has_placement;
    const yearsUntilGrad = this.calculateYearsUntilGraduation(surveyData);

    // Initialize result structure
    const result: EligibilityResult = {
      primary_tab: '',
      secondary_tabs: [],
      commentary: {},
    };

    // High school processing
    if (educationStage === EDUCATION_STAGES.HIGH_SCHOOL) {
      return this.processHighSchool(result, sector);
    }

    // University processing
    if (educationStage === EDUCATION_STAGES.UNIVERSITY) {
      const yearOfStudy = this.calculateYearOfStudy(surveyData);
      return this.processUniversity(result, yearsUntilGrad, yearOfStudy, hasPlacement, hasGradOffer, hasExperience, hasSpringWeeks, sector, surveyData);
    }

    // Graduate processing
    if (educationStage === EDUCATION_STAGES.GRADUATE) {
      return this.processGraduate(result, hasExperience || hasPlacement, sector);
    }


    // Default case
    result.primary_tab = 'Pre-University';
    result.commentary = { 
      [result.primary_tab]: COMMENTARY_TEXTS[this.getSectorCommentaryKey('High School', sector)]
    };
    return result;
  }

  private getSectorCommentaryKey(baseKey: string, sector?: string): keyof typeof COMMENTARY_TEXTS {
    if (!sector) return baseKey as keyof typeof COMMENTARY_TEXTS;
    
    const sectorKey = sector === SECTORS.TECH ? `Tech ${baseKey}` :
                     sector === SECTORS.LAW ? `Law ${baseKey}` :
                     sector === SECTORS.FINANCE ? `Finance ${baseKey}` :
                     baseKey;

    // Check if sector-specific key exists, fallback to base key
    return (sectorKey in COMMENTARY_TEXTS) ? 
           sectorKey as keyof typeof COMMENTARY_TEXTS : 
           baseKey as keyof typeof COMMENTARY_TEXTS;
  }

  private processHighSchool(result: EligibilityResult, sector?: string): EligibilityResult {
    result.primary_tab = 'Pre-University';
    result.secondary_tabs = [];
    result.commentary = { 
      [result.primary_tab]: COMMENTARY_TEXTS[this.getSectorCommentaryKey('High School', sector)]
    };
    return result;
  }

  private processUniversity(
    result: EligibilityResult, 
    yearsUntilGrad: number | null, 
    yearOfStudy: number, 
    hasPlacement: boolean, 
    hasGradOffer: boolean, 
    hasExperience: boolean,
    hasSpringWeeks: boolean,
    sector?: string,
    surveyData?: any
  ): EligibilityResult {
    
    if (yearsUntilGrad === null) {
      return this.processEarlyUniversity(result, yearOfStudy, hasPlacement, sector);
    }

    // Calculate total degree duration to determine if in final year
    const startYear = parseInt(surveyData?.start_year);
    const graduationYear = parseInt(surveyData?.graduation_year);
    const totalDuration = graduationYear - startYear;
    const isInFinalYear = yearOfStudy >= totalDuration;


    // More than 2 years until graduation
    if (yearsUntilGrad > 2) {
      return this.processEarlyUniversity(result, yearOfStudy, hasPlacement, sector);
    }


    // Year 2 + industrial placement (highest priority - regardless of years until graduation)
    if (yearOfStudy === 2 && hasPlacement) {
      result.primary_tab = 'Industrial Placements';

      if (sector === SECTORS.FINANCE) {
        result.secondary_tabs = ['Off-Cycle Internships'];
        result.commentary = {
          [result.primary_tab]: COMMENTARY_TEXTS['Finance Two Years Out Industrial Placement'],
          [result.secondary_tabs[0]]:  COMMENTARY_TEXTS['Finance Two Years Out Off-Cycle Internship']
        };

      } else {
        // Process tech instead
        result.secondary_tabs = [];
        result.commentary = {
          [result.primary_tab]: COMMENTARY_TEXTS['Tech Two Years Out Industrial Placement']
        };
      }
      return result;
    }
  
    // Exactly 2 years until graduation (standard case)
    if (yearsUntilGrad === 2) {
      // Finance sector: 2 years out
      if (sector === SECTORS.FINANCE) {
      if (hasPlacement) {
        // Finance with placement: Industrial Placements primary, Spring Weeks secondary
        result.primary_tab = 'Industrial Placements';
        result.secondary_tabs = ['Spring Weeks'];
        result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS[this.getSectorCommentaryKey('Two Years Out Spring', sector)]
        };
      } else {
        // Finance without placement: Spring Weeks primary, no secondary
        result.primary_tab = 'Spring Weeks';
        result.secondary_tabs = [];
        result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS[this.getSectorCommentaryKey('Two Years Out Spring', sector)]
        };
      }
      } else if (sector === SECTORS.TECH) {
      if (hasPlacement) {
        // Tech with placement: Industrial Placements primary, Insight Programmes secondary
        result.primary_tab = 'Industrial Placements';
        result.secondary_tabs = ['Insight Programmes'];
        result.commentary = {
        [result.secondary_tabs[0]]: COMMENTARY_TEXTS['Tech Two Years From Grad']
        };
      } else {
        // Tech without placement: Insight Programmes primary, no secondary
        result.primary_tab = 'Insight Programmes';
        result.secondary_tabs = [];
        result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS['Tech Two Years From Grad']
        };
      }
      } else if (sector === SECTORS.LAW) {
      result.primary_tab = 'First Year Programmes';
      result.secondary_tabs = [];
      result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS['Law Two Years Out FYP']
      };
      }
      return result;
    }

    // 1 year until graduation (penultimate year) - only if NOT in final year of study
    if (yearsUntilGrad === 1 && !isInFinalYear) {
      if (sector === SECTORS.FINANCE) {
      result.primary_tab = 'Summer Internships';
      result.secondary_tabs = ['Spring Weeks'];
      result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS[this.getSectorCommentaryKey('Penultimate Summer Internship', sector)],
        [result.secondary_tabs[0]]: COMMENTARY_TEXTS[this.getSectorCommentaryKey('Penultimate Spring Week', sector)]
      };
      } else if (sector === SECTORS.TECH) {
      result.primary_tab = 'Summer Internships';
      result.secondary_tabs = ['Insight Programmes'];
      result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS[this.getSectorCommentaryKey('Penultimate Summer Internship', sector)],
        [result.secondary_tabs[0]]: COMMENTARY_TEXTS[this.getSectorCommentaryKey('Penultimate Spring Week', sector)]
      };
      } else if (sector === SECTORS.LAW) {
      result.primary_tab = 'Vacation Schemes';
      result.secondary_tabs = ['Non-Law Internships'];
      result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS['Law Penultimate Vacation'],
        [result.secondary_tabs[0]]: COMMENTARY_TEXTS['Law Penultimate Non-Law Internships']
      };
      }
      return result;
    }


    // Final year - check if in final year of study OR 0 years until grad
    if (isInFinalYear || yearsUntilGrad === 0) {
      return this.processFinalYear(result, hasGradOffer, hasExperience || hasPlacement, sector);
    }
    
    // Default fallback
    return this.processEarlyUniversity(result, yearOfStudy, hasPlacement, sector);
  }

  private processEarlyUniversity(result: EligibilityResult, yearOfStudy: number, hasPlacement: boolean, sector?: string): EligibilityResult {
    if (hasPlacement) {
      // Placement students: Industrial Placements primary, Spring Weeks/Insight Programmes secondary
      result.primary_tab = 'Industrial Placements';

      if (sector === SECTORS.FINANCE) {
        result.secondary_tabs = ['Spring Weeks'];
        result.commentary = {
          [result.secondary_tabs[0]]: COMMENTARY_TEXTS[this.getSectorCommentaryKey('More Than Two Years Out Spring', sector)]
        };
      } else if (sector === SECTORS.TECH) {
        result.secondary_tabs = ['Insight Programmes'];
        result.commentary = {
          [result.secondary_tabs[0]]: COMMENTARY_TEXTS['Tech More Than Two Years Out Spring']
        };
      } else if (sector === SECTORS.LAW) {
        // Law sector
        result.secondary_tabs = ['Spring Weeks'];
        result.commentary = {
          [result.secondary_tabs[0]]: COMMENTARY_TEXTS[this.getSectorCommentaryKey('More Than Two Years Out Spring', sector)]
        };
      }
    } else {
      // No placement: Spring Weeks/Insight Programmes primary, no secondary
      if (sector === SECTORS.FINANCE) {
        result.primary_tab = 'Spring Weeks';
        result.secondary_tabs = [];
        result.commentary = { 
          [result.primary_tab]: COMMENTARY_TEXTS[this.getSectorCommentaryKey('More Than Two Years Out Spring', sector)]
        };
      } else if (sector === SECTORS.TECH) {
        result.primary_tab = 'Insight Programmes';
        result.secondary_tabs = [];
        result.commentary = { 
          [result.primary_tab]: COMMENTARY_TEXTS['Tech More Than Two Years Out Spring']
        };
      } else if (sector === SECTORS.LAW) {
        // Law sector
        result.primary_tab = 'First Year Schemes';
        result.secondary_tabs = [];
        result.commentary = {
          [result.primary_tab]: COMMENTARY_TEXTS['Law More Than Two Years Out FYP']
        };
      }
    }
    return result;
  }

  private processFinalYear(result: EligibilityResult, hasGradOffer: boolean, hasRelevantExperience: boolean, sector?: string): EligibilityResult {
    if (sector === SECTORS.FINANCE) {
      return this.processFinanceFinalYear(result, hasGradOffer, hasRelevantExperience);
    } else if (sector === SECTORS.TECH) {
      return this.processTechFinalYear(result, hasGradOffer, hasRelevantExperience);
    } else if (sector === SECTORS.LAW) {
      return this.processFinalLawYear(result, hasGradOffer, hasRelevantExperience);
    }
    
    // Add default return statement
    return result;
  }

  private processFinanceFinalYear(result: EligibilityResult, hasGradOffer: boolean, hasRelevantExperience: boolean): EligibilityResult {
    if (hasGradOffer) {
      result.primary_tab = 'Graduate Schemes';
      result.secondary_tabs = ['Summer Internships', 'Off-Cycle Internships'];
      result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS['Finance Final Year Grad Offer Grad Scheme'],
        'Summer Internships': COMMENTARY_TEXTS['Finance Final Year Grad Offer Summer Internship'],
        'Off-Cycle Internships': COMMENTARY_TEXTS['Finance Final Year Grad Offer Off-Cycle Internship']
      };
    } else if (hasRelevantExperience) {
      result.primary_tab = 'Off-Cycle Internships';
      result.secondary_tabs = ['Summer Internships', 'Graduate Schemes'];
      result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS['Finance Final Year With Exp Off-Cycle Internship'],
        'Summer Internships': COMMENTARY_TEXTS['Finance Final Year With Exp Summer Internship'],
        'Graduate Schemes': COMMENTARY_TEXTS['Finance Final Year With Exp Grad Scheme']
      };
    } else {
      result.primary_tab = 'Summer Internships';
      result.secondary_tabs = ['Off-Cycle Internships', 'Graduate Schemes'];
      result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS['Finance Final Year No Exp Summer Internship'],
        'Graduate Schemes': COMMENTARY_TEXTS['Finance Final Year No Exp Grad Scheme'],
        'Off-Cycle Internships': COMMENTARY_TEXTS['Finance Final Year No Exp Off-Cycle Internship']
      };
    }
    return result;
  }

  private processTechFinalYear(result: EligibilityResult, hasGradOffer: boolean, hasRelevantExperience: boolean): EligibilityResult {
    if (hasGradOffer) {
      result.primary_tab = 'Graduate Schemes';
      result.secondary_tabs = ['Summer Internships'];
      result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS['Tech Final Year Grad Offer Grad Scheme'],
        [result.secondary_tabs[0]]: COMMENTARY_TEXTS['Tech Final Year Grad Offer Summer Internship']
      };
    } else {
      result.primary_tab = 'Graduate Schemes';
      result.secondary_tabs = ['Summer Internships'];
      result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS['Tech Final Year Grad Scheme'],
        [result.secondary_tabs[0]]: COMMENTARY_TEXTS['Tech Final Year Summer Internship']
      };
    }
    return result;
  }

  private processFinalLawYear(result: EligibilityResult, hasGradOffer: boolean, hasRelevantExperience: boolean): EligibilityResult {
    result.primary_tab = 'Training Contracts';
    result.secondary_tabs = ['Vacation Schemes'];
    result.commentary = {
      [result.primary_tab]: COMMENTARY_TEXTS['Law Final Year Training Contracts'],
      [result.secondary_tabs[0]]: COMMENTARY_TEXTS['Law Final Year Vacation']
    };
    return result;
  }

  private processGraduate(result: EligibilityResult, hasRelevantExperience: boolean, sector?: string): EligibilityResult {
    if (sector === SECTORS.FINANCE) {
      // Finance: Different logic based on experience
      if (hasRelevantExperience) {
        result.primary_tab = 'Off-Cycle Internships';
        result.secondary_tabs = ['Graduate Schemes'];
        result.commentary = {
          [result.primary_tab]: COMMENTARY_TEXTS['Finance Grad With Exp Off-Cycle Internship'],
          'Graduate Schemes': COMMENTARY_TEXTS['Finance Grad With Exp Grad Scheme']
        };
      } else {
        result.primary_tab = 'Graduate Schemes';
        result.secondary_tabs = ['Off-Cycle Internships'];
        result.commentary = {
          [result.primary_tab]: COMMENTARY_TEXTS['Finance Grad No Exp Grad Scheme'],
          'Off-Cycle Internships': COMMENTARY_TEXTS['Finance Grad No Exp Off-Cycle Internship']
        };
      }
    } else if (sector === SECTORS.TECH) {
      // Tech: Always Graduate Schemes only
      result.primary_tab = 'Graduate Schemes';
      result.secondary_tabs = [];
      result.commentary = {
        [result.primary_tab]: hasRelevantExperience
          ? COMMENTARY_TEXTS['Tech Grad Exp Grad Scheme']
          : COMMENTARY_TEXTS['Tech Grad No Exp Grad Scheme']
      };
    } else if (sector === SECTORS.LAW) {
      // Law sector
      result.primary_tab = 'Training Contracts';
      result.secondary_tabs = [];
      result.commentary = {
        [result.primary_tab]: COMMENTARY_TEXTS['Law Grad Training Contracts']
      };
    }
    return result;
  }
}
