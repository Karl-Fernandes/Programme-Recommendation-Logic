#!/bin/python
from datetime import datetime

class SurveyProcessor:
    def __init__(self, data):
        # 'data' is the survey JSON dict
        self.data = data
        self.primary_tab = None
        self.secondary_tabs = []
        self.commentary = {}
        
    def process(self):
        # First, calculate the year_of_study if not provided
        if 'year_of_study' not in self.data and self.data.get('start_year'):
            self.data['year_of_study'] = self.calculate_year_of_study()
    
        # Extract needed fields (example keys)
        edu_stage = self.data.get('education_stage', '').lower()
        year_of_study = self.data.get('year_of_study', 0)  # integer e.g. 1, 2, 3, 4
        graduation_year = self.data.get('graduation_year')  # year e.g. 2025
        current_year = datetime.now().year 
        has_placement = self.data.get('has_placement', False)
        has_grad_offer = self.data.get('has_grad_offer', False)
        has_experience = self.data.get('has_experience', False)
        graduated = self.data.get('graduated', False)
    
        # Set graduated flag based on education_stage if not provided
        if edu_stage == 'graduate':
            graduated = True
    
        # Print debug information to help troubleshoot
        print(f"Processing survey data: {self.data}")
        print(f"Year of study: {year_of_study}")
        print(f"Graduation year: {graduation_year}")
        print(f"Current year: {current_year}")
        
        # FIX HERE: Check if graduation_year exists before calculating years_until_grad
        years_until_grad = None
        if graduation_year is not None:
            try:
                years_until_grad = graduation_year - current_year
            except:
                # If graduation_year can't be subtracted from current_year
                # (possibly because it's a string), try converting
                try:
                    years_until_grad = int(graduation_year) - current_year
                except:
                    years_until_grad = None
                    print(f"Error calculating years_until_grad with graduation_year: {graduation_year}")

        # Define commentary texts for reuse
        commentary_texts = {
            'Pre-University': "As a high school student, every opportunity you are eligible for will be listed on the Pre-University tab.",
            'Spring Weeks': ("As you are two years away from graduating, every opportunity you are eligible for will be listed on the Spring Weeks tab. "
                             "This includes a handful of summer internships open for all students."),
            'Industrial Placements': "As a second-year student, you should now be applying for industrial placement programmes. These are relatively uncompetitive because the pool of candidates is much smaller.",
            'Off-Cycle Internships': ("It is also possible to fill your industrial placement year with 2 off-cycle internships. "
                                      "However, these programmes are far more competitive and securing two internships that align in timing will be challenging."),
            'Summer Internships': ("As a penultimate-year student, summer internships are the ideal opportunity to gain experience and receive a graduate offer."),
            'Graduate Schemes': ("Because you already have a graduate scheme, you should not prioritise applying for internships which you risk not converting to the full-time position. "
                                 "Although more competitive, it would be safer to continue applying for other graduate programmes."),
            'Final Year No Offer Exp': ("Because you have previous experience, you will be a strong candidate for off-cycle internships. "
                                       "These programmes have less applicants and are suitable for upcoming graduates, often converting to a full-time position."),
            'Final Year No Offer No Exp': ("You can become eligible for summer internships by writing 'Intended Master's Degree' on your resume. These programmes are less competitive "
                                         "and are a reliable route into receiving a full-time offer. Because you have no relevant experience, applying for summer internships will give you the best chance of receiving an offer"),
            'Graduated Exp': ("Because you have relevant experience, you have the opportunity to pass CV screening for off-cycle internships which are typically unattainable for those without past internships."),
            'Graduated No Exp': ("Because you have no relevant experience, we recommend targeting graduate roles at less competitive companies or divisions such as Big 4, or risk/operations at banks as these are often attainable for candidates with no experience."),
        }

        # Logic starts here - Default to Spring Weeks in case nothing matches
        self.primary_tab = "Spring Weeks"
        self.commentary[self.primary_tab] = commentary_texts['Spring Weeks']

        if edu_stage == 'high school':
            self.primary_tab = "Pre-University"
            self.secondary_tabs = []
            self.commentary = {self.primary_tab: commentary_texts['Pre-University']}

        elif edu_stage == 'pre-university':
            # This could be treated similar to high school?
            self.primary_tab = "Pre-University"
            self.secondary_tabs = []
            self.commentary = {self.primary_tab: commentary_texts['Pre-University']}

        elif edu_stage == 'university':
            if graduated:
                # Graduated university logic
                if has_experience:
                    self.primary_tab = "Off-Cycle Internships"
                    self.secondary_tabs = ["Graduate Schemes"]
                    self.commentary = {
                        self.primary_tab: commentary_texts['Graduated Exp'],
                        "Graduate Schemes": commentary_texts['Graduate Schemes']
                    }
                else:
                    self.primary_tab = "Graduate Schemes"
                    self.secondary_tabs = ["Off-Cycle Internships"]
                    self.commentary = {
                        self.primary_tab: commentary_texts['Graduated No Exp'],
                        "Off-Cycle Internships": commentary_texts['Off-Cycle Internships']
                    }

            else:
                # Still studying
                if years_until_grad is None:
                    # missing info, fallback
                    self.primary_tab = "Spring Weeks"
                    self.secondary_tabs = []
                    self.commentary = {self.primary_tab: commentary_texts['Spring Weeks']}
                    
                elif years_until_grad > 2:
                    # More than 2 years out
                    if has_placement:
                        self.primary_tab = "Industrial Placements"
                        self.secondary_tabs = ["Spring Weeks"]
                        self.commentary = {
                            self.primary_tab: commentary_texts['Industrial Placements'],
                            "Spring Weeks": commentary_texts['Spring Weeks']
                        }
                    else:
                        self.primary_tab = "Spring Weeks"
                        self.secondary_tabs = []
                        self.commentary = {self.primary_tab: commentary_texts['Spring Weeks']}

                elif years_until_grad == 2:
                    # Two years out from graduation
                    if year_of_study == 2 and has_placement:
                        self.primary_tab = "Industrial Placements"
                        self.secondary_tabs = ["Off-Cycle Internships"]
                        self.commentary = {
                            self.primary_tab: commentary_texts['Industrial Placements'],
                            "Off-Cycle Internships": commentary_texts['Off-Cycle Internships']
                        }
                    elif year_of_study == 3:
                        # Penultimate year
                        self.primary_tab = "Summer Internships"
                        self.secondary_tabs = ["Spring Weeks"]
                        self.commentary = {
                            self.primary_tab: commentary_texts['Summer Internships'],
                            "Spring Weeks": commentary_texts['Spring Weeks']
                        }
                    elif year_of_study == 4:
                        # Final year - no grad offer logic assumed here
                        if has_grad_offer:
                            self.primary_tab = "Graduate Schemes"
                            self.secondary_tabs = ["Summer Internships", "Off-Cycle Internships"]
                            self.commentary = {
                                self.primary_tab: commentary_texts['Graduate Schemes'],
                                "Summer Internships": commentary_texts['Summer Internships'],
                                "Off-Cycle Internships": commentary_texts['Off-Cycle Internships']
                            }
                        else:
                            if has_experience:
                                self.primary_tab = "Off-Cycle Internships"
                                self.secondary_tabs = ["Summer Internships", "Graduate Schemes"]
                                self.commentary = {
                                    self.primary_tab: commentary_texts['Final Year No Offer Exp'],
                                    "Summer Internships": commentary_texts['Summer Internships'],
                                    "Graduate Schemes": commentary_texts['Graduate Schemes']
                                }
                            else:
                                self.primary_tab = "Summer Internships"
                                self.secondary_tabs = ["Off-Cycle Internships", "Graduate Schemes"]
                                self.commentary = {
                                    self.primary_tab: commentary_texts['Final Year No Offer No Exp'],
                                    "Graduate Schemes": commentary_texts['Graduate Schemes'],
                                    "Off-Cycle Internships": commentary_texts['Off-Cycle Internships']
                                }
                    else:
                        # default fallback
                        self.primary_tab = "Spring Weeks"
                        self.secondary_tabs = []
                        self.commentary = {self.primary_tab: commentary_texts['Spring Weeks']}
                
                # Special case for Year 3 with less than 2 years until graduation
                elif year_of_study == 3:
                    self.primary_tab = "Summer Internships"
                    self.secondary_tabs = ["Off-Cycle Internships"]
                    self.commentary = {
                        self.primary_tab: commentary_texts['Summer Internships'],
                        "Off-Cycle Internships": commentary_texts['Off-Cycle Internships']
                    }

        # Default fallback if nothing else matched
        if not self.primary_tab:
            self.primary_tab = "Pre-University"
            self.secondary_tabs = []
            self.commentary = {self.primary_tab: commentary_texts['Pre-University']}

        print(f"Generated recommendations: {self.primary_tab}, {self.secondary_tabs}")

        return {
            "primary_tab": self.primary_tab,
            "secondary_tabs": self.secondary_tabs,
            "commentary": self.commentary
        }
    
    
    
    def get_next_step(self):
        """Determine the next question to ask based on current answers"""
        # Check if this is a request to go back to the previous step
        is_previous_request = self.data.get('is_previous', False)
        
        # If going back, check for the explicit previous step first, then fall back to the history
        if is_previous_request:
            # Get explicit previous step if provided
            previous_step = self.data.get('previous_step')
            
            if previous_step is not None:
                print(f"Navigating to explicit previous step: {previous_step}")
                # Return the appropriate question for that step
                return self.get_step_question(previous_step)
                
            # Fall back to previous_steps array if explicit step not provided
            previous_steps = self.data.get('previous_steps', [])
            if previous_steps:
                previous_step = previous_steps[-1]
                print(f"Navigating to previous step from history: {previous_step}")
                return self.get_step_question(previous_step)
                
            # No previous step info available
            print("No previous step information available")
            return self.get_step_question(1)  # Default to step 1
        
        # Regular next step logic
        current_step = self.data.get('current_step', 0)
        education_stage = self.data.get('education_stage', '')
        start_year = self.data.get('start_year')
        graduation_year = self.data.get('graduation_year')
        year_of_study = self.calculate_year_of_study()
        has_spring_weeks = self.data.get('has_spring_weeks')
        
        # Step 0 (Welcome) -> Step 1 (Education Stage)
        if current_step == 0:
            return {
                'next_step': 1,
                'question': 'What stage of education are you in?',
                'type': 'select',
                'options': ['high school', 'university', 'graduate']
            }
            
        # Step 1 (Education Stage) -> Branch based on answer
        elif current_step == 1:
            if not education_stage:
                return {'next_step': 1, 'error': 'Please select an education stage'}
                
            if education_stage == 'high school':
                return {
                    'next_step': 'final',
                    'message': 'Thank you for providing your education information.'
                }
                
            elif education_stage == 'university':
                return {
                    'next_step': 2,
                    'question': 'When did you start your degree and when will you graduate?',
                    'type': 'year_selection',
                    'has_placement': True
                }
                
            elif education_stage == 'graduate':
                return {
                    'next_step': 'internship_experience',
                    'question': 'Have you completed any prior relevant Summer Internships or Full-Time work?',
                    'type': 'boolean'
                }
        
        # Step 2 (University Timeline) -> Spring Weeks or Final
        elif current_step == 2 and education_stage == 'university':
            if not start_year or not graduation_year:
                return {'next_step': 2, 'error': 'Please select both start and graduation years'}
            
            if year_of_study >= 2:
                return {
                    'next_step': 3,
                    'question': 'Have you completed any prior Spring Weeks?',
                    'type': 'boolean'
                }
            else:
                return {'next_step': 'final'}
                
        # Step 3 (Spring Weeks) -> Conversion or Internship Experience
        elif current_step == 3:
            if has_spring_weeks is None:
                return {'next_step': 3, 'error': 'Please answer the Spring Weeks question'}
                
            if has_spring_weeks:
                return {
                    'next_step': 4,
                    'question': 'Did you convert any of these into a Summer Internship offer?',
                    'type': 'boolean'
                }
            else:
                return {
                    'next_step': 'internship_experience',
                    'question': 'Have you completed any prior relevant Summer Internships or Full-Time work?',
                    'type': 'boolean'
                }
                
        # Step 4 (Spring Week Conversion) -> Internship Experience
        elif current_step == 4:
            return {
                'next_step': 'internship_experience',
                'question': 'Have you completed any prior relevant Summer Internships or Full-Time work?',
                'type': 'boolean'
            }
            
        # Step 5 (Internship Experience) -> Graduate Offer or Final
        elif current_step == 'internship_experience':
            if year_of_study == 4:
                return {
                    'next_step': 'grad_offer',
                    'question': 'Do you have a graduate offer already?',
                    'type': 'boolean'
                }
            else:
                return {'next_step': 'final'}
                
        # End of survey
        return {'next_step': 'final'}
    
    def get_step_question(self, step):
        """Return the appropriate question for a specific step"""
        education_stage = self.data.get('education_stage', '')
        year_of_study = self.calculate_year_of_study()
        
        # Step 1 (Education Stage)
        if step == 1:
            return {
                'next_step': 1,
                'question': 'What stage of education are you in?',
                'type': 'select',
                'options': ['high school', 'university', 'graduate']
            }
        
        # Step 2 (University Timeline)
        elif step == 2 and education_stage == 'university':
            return {
                'next_step': 2,
                'question': 'When did you start your degree and when will you graduate?',
                'type': 'year_selection',
                'has_placement': True
            }
        
        # Step 3 (Spring Weeks)
        elif step == 3:
            return {
                'next_step': 3,
                'question': 'Have you completed any prior Spring Weeks?',
                'type': 'boolean'
            }
        
        # Step 4 (Spring Week Conversion)
        elif step == 4:
            return {
                'next_step': 4,
                'question': 'Did you convert any of these into a Summer Internship offer?',
                'type': 'boolean'
            }
        
        # Internship Experience step
        elif step == 'internship_experience':
            return {
                'next_step': 'internship_experience',
                'question': 'Have you completed any prior relevant Summer Internships or Full-Time work?',
                'type': 'boolean'
            }
        
        # Graduate Offer step
        elif step == 'grad_offer':
            return {
                'next_step': 'grad_offer',
                'question': 'Do you have a graduate offer already?',
                'type': 'boolean'
            }
        
        # Default fallback if the step doesn't match any known step
        return {'next_step': 1, 'error': 'Invalid step requested'}
    
    def calculate_year_of_study(self):
        start_year = self.data.get('start_year')
        if not start_year:
            return None
        return datetime.now().year - start_year + 1
    
    def validate_year_difference(self):
        start_year = self.data.get('start_year')
        graduation_year = self.data.get('graduation_year')
        
        if start_year and graduation_year:
            total_years = graduation_year - start_year
            if total_years < 1 or total_years > 7:
                return False
        return True

    def submit_survey(self):
        """Submit the survey data to the server"""
        self.loading = True
        self.error = ''
        
        # Calculate year_of_study if needed
        if self.data.get('start_year') and not self.data.get('year_of_study'):
            current_year = datetime.now().year
            self.data['year_of_study'] = current_year - self.data['start_year'] + 1
        
        # Set graduated flag based on education_stage
        self.data['graduated'] = self.data.get('education_stage') == 'graduate'
        
        print('Submitting survey data:', self.data)
        
        # Simulate server submission and response
        try:
            result = self.simulate_server_submission(self.data)
            print('Survey result:', result)
            self.loading = False
            self.eligibility_result = result
            
            # If result is empty or missing expected fields
            if not result or not result.get('primary_tab'):
                self.error = 'No recommendations received. The server may have encountered an error processing your data.'
        except Exception as err:
            self.loading = False
            self.error = 'Error submitting survey: ' + str(err)
            print('API error:', err)
    
    def simulate_server_submission(self, data):
        """Simulate the server-side processing of the survey data"""
        # This is a placeholder for the actual server interaction logic
        # In a real application, this would involve making an HTTP request to the server
        # For this simulation, we'll just return a mock result based on the input data
        
        print("Simulating server submission with data:", data)
        
        # Basic validation
        if not data.get('education_stage'):
            raise ValueError("Missing required field: education_stage")
        
        if data.get('education_stage') == 'high school':
            return {
                'primary_tab': 'Pre-University',
                'message': 'Thank you for providing your education information.'
            }
        
        # Further processing and mock result generation can be added here
        
        return {
            'primary_tab': 'Spring Weeks',
            'secondary_tabs': ['Industrial Placements'],
            'message': 'Based on your profile, we recommend considering the following opportunities.'
        }
