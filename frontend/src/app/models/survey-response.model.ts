// survey-response.model.ts
export interface SurveyResponse {
  education_stage: string;
  year_of_study?: number;
  graduation_year?: number;
  has_placement?: boolean;
  has_grad_offer?: boolean;
  has_experience?: boolean;
  graduated?: boolean;
}
