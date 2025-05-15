// survey-response.model.ts
export interface SurveyResponse {
  education_stage: string;
  start_year?: number;        // When they began their degree
  graduation_year?: number;   // When they will finish their degree
  year_of_study?: number;
  has_placement: boolean;
  has_grad_offer: boolean;
  has_experience: boolean;
  graduated: boolean;
}
