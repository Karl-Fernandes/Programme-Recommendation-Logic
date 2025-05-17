from datetime import datetime
from typing import Dict, List, Optional, Union
from uuid import uuid4

EDUCATION_STAGES = {
    'HIGH_SCHOOL': 'high school',
    'UNIVERSITY': 'university',
    'GRADUATE': 'graduate'
}

STEP_TYPES = {
    'WELCOME': 0,
    'EDUCATION_STAGE': 1,
    'UNIVERSITY_TIMELINE': 2,
    'SPRING_WEEKS': 3,
    'SPRING_CONVERSION': 4,
    'INTERNSHIP_EXPERIENCE': 'internship_experience',
    'GRAD_OFFER': 'grad_offer',
    'FINAL': 'final'
}

class SurveyProcessor:
    COMMENTARY_TEXTS = {
        'Pre-University': "As a high school student, every opportunity you are eligible for will be listed on the Pre-University tab.",
        'Spring Weeks': "As you are two years away from graduating, every opportunity you are eligible for will be listed on the Spring Weeks tab. This includes a handful of summer internships open for all students.",
        'Spring Weeks More Than 2': "As you are not two years out from graduation, you are technically not eligible for Spring Weeks. However, many 4+ year courses are flexible in their graduation date; if you are on an integrated Master's, your university will normally allow you to switch to a Bachelor's to become eligible for Spring Weeks with no issues. You can always switch back to an Integrated Master's if you change your mind. Similarly, if you have an industrial placement year, you can often switch to the equivalent course without an industrial placement to become eligible for Spring Weeks, and switch back after your spring weeks if you choose to continue with your industrial placement degree.",
        'Industrial Placements': "As a second-year student, you should now be applying for industrial placement programmes. These are relatively uncompetitive because the pool of candidates is much smaller.",
        'Industrial Placements First Year': "As a first-year student interested in placements, you should focus on building foundational skills and experiences. While it's early to apply for placements directly, you can prepare by researching companies, improving your CV, and gaining relevant experiences through societies or projects. You'll be in a stronger position to apply for placements in your second year.",
        'Off-Cycle Internships': "It is also possible to fill your industrial placement year with 2 off-cycle internships. However, these programmes are far more competitive and securing two internships that align in timing will be challenging.",
        'Off-Cycle Internships Grad No Exp': "You are eligible for off-cycle internships, but these are typically unattainable for those without relevant experience. You should still submit applications where possible, but prioritise applying for graduate programmes at less competitive companies.",
        'Summer Internships': "As a penultimate-year student, summer internships are the ideal opportunity to gain experience and receive a graduate offer.",
        'Graduate Schemes': "Because you already have a graduate scheme, you should not prioritise applying for internships which you risk not converting to the full-time position. Although more competitive, it would be safer to continue applying for other graduate programmes.",
        'Final Year No Offer Exp': "Because you have previous experience, you will be a strong candidate for off-cycle internships. These programmes have less applicants and are suitable for upcoming graduates, often converting to a full-time position.",
        'Final Year No Offer No Exp': "You can become eligible for summer internships by writing 'Intended Master's Degree' on your resume. These programmes are less competitive and are a reliable route into receiving a full-time offer. Because you have no relevant experience, applying for summer internships will give you the best chance of receiving an offer",
        'Graduated Exp': "Because you have relevant experience, you have the opportunity to pass CV screening for off-cycle internships which are typically unattainable for those without past internships.",
        'Graduated No Exp': "Because you have no relevant experience, we recommend targeting graduate roles at less competitive companies or divisions such as Big 4, or risk/operations at banks as these are often attainable for candidates with no experience."
    }

    def __init__(self, data: Dict):
        self.data = data
        self.primary_tab: Optional[str] = None
        self.secondary_tabs: List[str] = []
        self.commentary: Dict[str, str] = {}
        self.error: Optional[str] = None
        self.loading: bool = False

    def process(self) -> Dict[str, Union[str, List[str], Dict[str, str]]]:
        self.calculate_year_of_study()
        edu_stage = self.data.get('education_stage', '').lower()
        year_of_study = self.data.get('year_of_study', 0)
        graduation_year = self.data.get('graduation_year')
        has_placement = self.data.get('has_placement', False)
        has_grad_offer = self.data.get('has_grad_offer', False)
        has_experience = self.data.get('has_experience', False)
        years_until_grad = graduation_year - datetime.now().year if graduation_year else None

        self.data['graduated'] = edu_stage == 'graduate'

        if edu_stage == 'high school':
            return self._process_high_school()

        if edu_stage == 'graduate':
            return self._process_graduate(has_experience or has_placement)

        if edu_stage == 'university':
            return self._process_university(years_until_grad, year_of_study, has_placement, has_grad_offer, has_experience)

        return self._default_response()

    def _process_high_school(self) -> Dict:
        self.primary_tab = "Pre-University"
        self.commentary = {self.primary_tab: self.COMMENTARY_TEXTS['Pre-University']}
        return self._build_response()

    def _process_graduate(self, has_relevant_experience: bool) -> Dict:
        if has_relevant_experience:
            self.primary_tab = "Off-Cycle Internships"
            self.secondary_tabs = ["Graduate Schemes"]
            self.commentary = {
                self.primary_tab: self.COMMENTARY_TEXTS['Graduated Exp'],
                "Graduate Schemes": self.COMMENTARY_TEXTS['Graduate Schemes']
            }
        else:
            self.primary_tab = "Graduate Schemes"
            self.secondary_tabs = ["Off-Cycle Internships"]
            self.commentary = {
                self.primary_tab: self.COMMENTARY_TEXTS['Graduated No Exp'],
                "Off-Cycle Internships": self.COMMENTARY_TEXTS['Off-Cycle Internships Grad No Exp']
            }
        return self._build_response()

    def _process_university(self, years_until_grad: Optional[int], year_of_study: int, has_placement: bool, has_grad_offer: bool, has_experience: bool) -> Dict:
        if years_until_grad is None:
            return self._default_spring_weeks()

        if years_until_grad > 2:
            return self._process_early_university(year_of_study, has_placement)

        if years_until_grad == 2 and year_of_study == 2 and has_placement:
            self.primary_tab = "Industrial Placements"
            self.secondary_tabs = ["Off-Cycle Internships"]
            self.commentary = {
                self.primary_tab: self.COMMENTARY_TEXTS['Industrial Placements'],
                "Off-Cycle Internships": self.COMMENTARY_TEXTS['Off-Cycle Internships']
            }
            return self._build_response()

        if years_until_grad == 2:
            return self._default_spring_weeks()

        if years_until_grad == 1:
            self.primary_tab = "Summer Internships"
            self.secondary_tabs = ["Spring Weeks"]
            self.commentary = {
                self.primary_tab: self.COMMENTARY_TEXTS['Summer Internships'],
                "Spring Weeks": "You can become eligible for Spring Weeks by writing \"Intended Master's Degree\" on your resume. These serve as a less competitive route into great roles, and act as a backup option in case you fail to convert your summer internship this year. Many companies will not force you to complete the Master's Degree but even if they do, it will often be a favourable outcome regardless."
            }
            return self._build_response()

        if years_until_grad == 0:
            return self._process_final_year(has_grad_offer, has_experience or has_placement)

        return self._default_response()

    def _process_early_university(self, year_of_study: int, has_placement: bool) -> Dict:
        if has_placement:
            self.primary_tab = "Industrial Placements"
            self.secondary_tabs = ["Spring Weeks"] if year_of_study != 2 else ["Off-Cycle Internships"]
            self.commentary = {
                self.primary_tab: self.COMMENTARY_TEXTS['Industrial Placements First Year'] if year_of_study == 1 else "Although placements are typically completed after your second year, some companies offer flexible placement opportunities for later-year students. Consider reaching out directly to companies to inquire about placement possibilities aligned with your experience level.",
                self.secondary_tabs[0]: self.COMMENTARY_TEXTS['Off-Cycle Internships'] if year_of_study == 2 else self.COMMENTARY_TEXTS['Spring Weeks More Than 2']
            }
        else:
            self.primary_tab = "Spring Weeks"
            self.commentary = {self.primary_tab: self.COMMENTARY_TEXTS['Spring Weeks More Than 2']}
        return self._build_response()

    def _process_final_year(self, has_grad_offer: bool, has_relevant_experience: bool) -> Dict:
        if has_grad_offer:
            self.primary_tab = "Graduate Schemes"
            self.secondary_tabs = ["Summer Internships", "Off-Cycle Internships"]
            self.commentary = {
                self.primary_tab: self.COMMENTARY_TEXTS['Graduate Schemes'],
                "Summer Internships": "If you are deeply unsatisfied with your current graduate offer, you can become eligible for summer internships by writing \"Intended Master's Degree\" on your resume. These programmes are less competitive and typically convert to a full-time role, although it will likely clash with your graduate job and will require you to reject your current offer.",
                "Off-Cycle Internships": "If you are deeply unsatisfied with your current graduate offer, you can apply for off-cycle internships. These programmes are less competitive and often convert to a full-time role, although it will likely clash with your graduate job and will require you to reject your current offer."
            }
        elif has_relevant_experience:
            self.primary_tab = "Off-Cycle Internships"
            self.secondary_tabs = ["Summer Internships", "Graduate Schemes"]
            self.commentary = {
                self.primary_tab: self.COMMENTARY_TEXTS['Final Year No Offer Exp'],
                "Summer Internships": "You can become eligible for summer internships by writing \"Intended Master's Degree\" on your resume. These programmes are less competitive and are a reliable route into receiving a full-time offer.",
                "Graduate Schemes": "Graduate programmes are unrealistically competitive for most roles in finance. You should still send applications for less competitive companies, but prioritise off-cycle internships and summer internships."
            }
        else:
            self.primary_tab = "Summer Internships"
            self.secondary_tabs = ["Off-Cycle Internships", "Graduate Schemes"]
            self.commentary = {
                self.primary_tab: self.COMMENTARY_TEXTS['Final Year No Offer No Exp'],
                "Graduate Schemes": "Graduate programmes are unrealistically competitive for most roles in finance. You should still send applications for smaller or less competitive companies, but prioritise summer internships for the most competitive roles.",
                "Off-Cycle Internships": "You are eligible for off-cycle internships, but these are typically unattainable for those without relevant experience. You should still submit applications where possible, but prioritise applying for summer internships."
            }
        return self._build_response()

    def get_next_step(self) -> Dict:
        if self.data.get('is_previous', False):
            return self._get_previous_step()

        current_step = self.data.get('current_step', 0)
        education_stage = self.data.get('education_stage', '')
        start_year = self.data.get('start_year')
        graduation_year = self.data.get('graduation_year')
        has_spring_weeks = self.data.get('has_spring_weeks')
        year_of_study = self.calculate_year_of_study()

        if current_step == 0:
            return self._get_step_question(1)

        if current_step == 1:
            if not education_stage:
                return {'next_step': 1, 'error': 'Please select an education stage'}
            if education_stage == 'high school':
                return {'next_step': 'final', 'message': 'Thank you for providing your education information.'}
            if education_stage == 'university':
                return self._get_step_question(2)
            if education_stage == 'graduate':
                return self._get_step_question('internship_experience')

        if current_step == 2 and education_stage == 'university':
            if not start_year or not graduation_year:
                return {'next_step': 2, 'error': 'Please select both start and graduation years'}
            years_until_grad = graduation_year - datetime.now().year
            if year_of_study >= 2 or years_until_grad <= 0:
                return self._get_step_question(3)
            return {'next_step': 'final'}

        if current_step == 3:
            if has_spring_weeks is None:
                return {'next_step': 3, 'error': 'Please answer the Spring Weeks question'}
            return self._get_step_question(4 if has_spring_weeks else 'internship_experience')

        if current_step == 4:
            return self._get_step_question('internship_experience')

        if current_step == 'internship_experience':
            years_until_grad = graduation_year - datetime.now().year if graduation_year else None
            if years_until_grad == 0 or (year_of_study is not None and year_of_study >= 4):
                return self._get_step_question('grad_offer')
            return {'next_step': 'final'}

        return {'next_step': 'final'}

    def _get_step_question(self, step: Union[int, str]) -> Dict:
        if step == 1:
            return {
                'next_step': 1,
                'question': 'What stage of education are you in?',
                'type': 'select',
                'options': ['high school', 'university', 'graduate']
            }
        if step == 2:
            return {
                'next_step': 2,
                'question': 'When did you start your degree and when will you graduate?',
                'type': 'year_selection',
                'has_placement': True
            }
        if step == 3:
            return {
                'next_step': 3,
                'question': 'Have you completed any prior Spring Weeks?',
                'type': 'boolean'
            }
        if step == 4:
            return {
                'next_step': 4,
                'question': 'Did you convert any of these into a Summer Internship offer?',
                'type': 'boolean'
            }
        if step == 'internship_experience':
            return {
                'next_step': 'internship_experience',
                'question': 'Have you completed any prior relevant Summer Internships or Full-Time work?',
                'type': 'boolean'
            }
        if step == 'grad_offer':
            return {
                'next_step': 'grad_offer',
                'question': 'Do you have a graduate offer already?',
                'type': 'boolean'
            }
        return {'next_step': 1, 'error': 'Invalid step requested'}

    def calculate_year_of_study(self) -> Optional[int]:
        start_year = self.data.get('start_year')
        if not start_year:
            return None

        current_date = datetime.now()
        academic_year = current_date.year - 1 if current_date.month < 9 else current_date.year
        year_of_study = academic_year - start_year + 1
        self.data['year_of_study'] = year_of_study
        return year_of_study

    def validate_year_difference(self) -> bool:
        start_year = self.data.get('start_year')
        graduation_year = self.data.get('graduation_year')
        if start_year and graduation_year:
            total_years = graduation_year - start_year
            return 1 <= total_years <= 7
        return True

    def submit_survey(self) -> None:
        self.calculate_year_of_study()
        self.data['graduated'] = self.data.get('education_stage') == 'graduate'
        try:
            result = self._simulate_server_submission()
            self.loading = False
            self.eligibility_result = result
            if not result or not result.get('primary_tab'):
                self.error = 'No recommendations received. The server may have encountered an error processing your data.'
        except Exception as err:
            self.loading = False
            self.error = f'Error submitting survey: {str(err)}'

    def _simulate_server_submission(self) -> Dict:
        if not self.data.get('education_stage'):
            raise ValueError("Missing required field: education_stage")
        if self.data.get('education_stage') == 'high school':
            return {
                'primary_tab': 'Pre-University',
                'message': 'Thank you for providing your education information.'
            }
        return {
            'primary_tab': 'Spring Weeks',
            'secondary_tabs': ['Industrial Placements'],
            'message': 'Based on your profile, we recommend considering the following opportunities.'
        }

    def _get_previous_step(self) -> Dict:
        current_step = self.data.get('current_step')
        step_sequence = [0, 1, 2, 3, 4, 'internship_experience', 'grad_offer', 'final']
        special_cases = {
            'internship_experience': 4 if self.data.get('has_spring_weeks') else 3,
            'grad_offer': 'internship_experience'
        }

        if current_step in special_cases:
            prev_step = special_cases[current_step]
        else:
            idx = step_sequence.index(current_step) if current_step in step_sequence else 1
            prev_step = step_sequence[max(0, idx - 1)]

        return self._get_step_question(prev_step)

    def _default_spring_weeks(self) -> Dict:
        self.primary_tab = "Spring Weeks"
        self.commentary = {self.primary_tab: self.COMMENTARY_TEXTS['Spring Weeks']}
        return self._build_response()

    def _default_response(self) -> Dict:
        self.primary_tab = "Pre-University"
        self.commentary = {self.primary_tab: self.COMMENTARY_TEXTS['Pre-University']}
        return self._build_response()

    def _build_response(self) -> Dict:
        return {
            "primary_tab": self.primary_tab,
            "secondary_tabs": self.secondary_tabs,
            "commentary": self.commentary
        }