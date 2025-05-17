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
        if graduation_year is not None and isinstance(graduation_year, int):
            years_until_grad = graduation_year - current_year
        else:
            years_until_grad = None

        # Define commentary texts for reuse
        commentary_texts = {
            'Pre-University': "As a high school student, every opportunity you are eligible for will be listed on the Pre-University tab.",
            'Spring Weeks': ("As you are two years away from graduating, every opportunity you are eligible for will be listed on the Spring Weeks tab. "
                             "This includes a handful of summer internships open for all students."),
            'Spring Weeks More Than 2': ("As you are not two years out from graduation, you are technically not eligible for Spring Weeks. However, many 4+ year courses are flexible in their graduation date; if you are on an integrated Master's, your university will normally allow you to switch to a Bachelor's to become eligible for Spring Weeks with no issues. You can always switch back to an Integrated Master's if you change your mind. Similarly, if you have an industrial placement year, you can often switch to the equivalent course without an industrial placement to become eligible for Spring Weeks, and switch back after your spring weeks if you choose to continue with your industrial placement degree."),
            'Industrial Placements': "As a second-year student, you should now be applying for industrial placement programmes. These are relatively uncompetitive because the pool of candidates is much smaller.",
            'Industrial Placements First Year': "As a first-year student interested in placements, you should focus on building foundational skills and experiences. While it's early to apply for placements directly, you can prepare by researching companies, improving your CV, and gaining relevant experiences through societies or projects. You'll be in a stronger position to apply for placements in your second year.",
            'Off-Cycle Internships': ("It is also possible to fill your industrial placement year with 2 off-cycle internships. "
                                      "However, these programmes are far more competitive and securing two internships that align in timing will be challenging."),
            'Off-Cycle Interships Grad No Exp': ("You are eligible for off-cycle internships, but these these are typically unattainable for those without relevant experience. You should still submit applications where possible, but prioritise applying for graduate programmes at less competitive companies."),
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

        elif edu_stage == 'graduate':
            # Graduated university logic
            has_placement_experience = self.data.get('has_placement', False)
            has_relevant_experience = has_placement_experience or has_experience

            if has_relevant_experience:
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
                    "Off-Cycle Internships": commentary_texts['Off-Cycle Interships Grad No Exp']
                }

        elif edu_stage == 'university':
            # Still studying
                if years_until_grad is None:
                    # missing info, fallback
                    self.primary_tab = "Spring Weeks"
                    self.secondary_tabs = []
                    self.commentary = {self.primary_tab: commentary_texts['Spring Weeks']}
                    
                elif years_until_grad > 2:
                    # More than 2 years out - keep your existing logic here
                    if has_placement:
                        self.primary_tab = "Industrial Placements"
                        
                        # Second year students with placement specifically need Off-Cycle Internships as secondary tab
                        if year_of_study == 2:
                            self.secondary_tabs = ["Off-Cycle Internships"]
                            placement_commentary = ("As a second-year student, this is the optimal time to apply for industrial placement programmes. "
                                                   "These are relatively uncompetitive because the pool of candidates is much smaller.")
                            self.commentary = {
                                self.primary_tab: placement_commentary,
                                "Off-Cycle Internships": ("It is also possible to fill your industrial placement year with 2 off-cycle internships. "
                                                        "However, these programmes are far more competitive and securing two internships that align "
                                                        "in timing will be challenging.")
                            }
                        else:
                            # First year or later years
                            self.secondary_tabs = ["Spring Weeks"]
                            
                            # Choose the right message based on year of study
                            if year_of_study == 1:
                                placement_commentary = ("As a first-year student interested in placements, focus on building foundational skills and experiences. "
                                                       "Research companies, improve your CV, and gain relevant experiences through societies or projects. "
                                                       "You'll be in a stronger position to apply for placements next year.")
                            # Later years
                            else:
                                placement_commentary = ("Although placements are typically completed after your second year, some companies offer flexible " 
                                                      "placement opportunities for later-year students. Consider reaching out directly to companies to " 
                                                      "inquire about placement possibilities aligned with your experience level.")
                            

                            self.commentary = {
                                self.primary_tab: placement_commentary,
                                "Spring Weeks": commentary_texts['Spring Weeks More Than 2']
                            }
                    else:
                        self.primary_tab = "Spring Weeks"
                        self.secondary_tabs = []
                        self.commentary = {self.primary_tab: commentary_texts['Spring Weeks More Than 2']}

                elif years_until_grad == 1:
                    # Penultimate year - doesn't matter if it's year 2 (Bachelor's) or year 3 (Master's)
                    self.primary_tab = "Summer Internships"
                    self.secondary_tabs = ["Spring Weeks"]  # Changed from "Off-Cycle Internships"
                    self.commentary = {
                        self.primary_tab: commentary_texts['Summer Internships'],
                        "Spring Weeks": ("You can become eligible for Spring Weeks by writing \"Intended Master's Degree\" on your resume. "
                                        "These serve as a less competitive route into great roles, and act as a backup option in case you fail "
                                        "to convert your summer internship this year. Many companies will not force you to complete the "
                                        "Master's Degree but even if they do, it will often be a favourable outcome regardless.")
                    }
                    
                elif years_until_grad == 2:
                    # Two years out from graduation
                    
                    # Special case for year 2 students with placement option
                    if year_of_study == 2 and has_placement:
                        self.primary_tab = "Industrial Placements"
                        self.secondary_tabs = ["Off-Cycle Internships"]  # <-- Changed from Spring Weeks
                        self.commentary = {
                            self.primary_tab: "As a second-year student, you should now be applying for industrial placement programmes. These are relatively uncompetitive because the pool of candidates is much smaller.",
                            "Off-Cycle Internships": "It is also possible to fill your industrial placement year with 2 off-cycle internships. However, these programmes are far more competitive and securing two internships that align in timing will be challenging."
                        }
                    else:
                        # Regular spring weeks logic for other cases
                        self.primary_tab = "Spring Weeks"
                        self.secondary_tabs = []
                        self.commentary = {
                            self.primary_tab: commentary_texts['Spring Weeks']
                        }
                elif years_until_grad == 3:
                    # Special case for Year 3 with less than 2 years until graduation
                    self.primary_tab = "Summer Internships"
                    self.secondary_tabs = ["Off-Cycle Internships"]
                    self.commentary = {
                        self.primary_tab: commentary_texts['Summer Internships'],
                        "Off-Cycle Internships": commentary_texts['Off-Cycle Internships']
                    }
                # Final year with graduate offer
                elif years_until_grad == 0:
                    # Final year logic
                    has_placement_experience = self.data.get('has_placement', False)
                    has_relevant_experience = has_experience or has_placement_experience

                    if has_grad_offer:
                        self.primary_tab = "Graduate Schemes"
                        self.secondary_tabs = ["Summer Internships", "Off-Cycle Internships"]
                        self.commentary = {
                            self.primary_tab: commentary_texts['Graduate Schemes'],
                            "Summer Internships": ("If you are deeply unsatisfied with your current graduate offer, "
                                                  "you can become eligible for summer internships by writing \"Intended Master's Degree\" "
                                                  "on your resume. These programmes are less competitive and typically convert to a "
                                                  "full-time role, although it will likely clash with your graduate job and will require "
                                                  "you to reject your current offer. Most firms will not force you to complete a Master's Degree."),
                            "Off-Cycle Internships": ("If you are deeply unsatisfied with your current graduate offer, "
                                                     "you can apply for off-cycle internships. These programmes are less competitive and "
                                                     "often convert to a full-time role, although it will likely clash with your graduate "
                                                     "job and will require you to reject your current offer.")
                        }
                    else:
                        # Final year with no offer, check if they have experience
                        if has_relevant_experience:
                            self.primary_tab = "Off-Cycle Internships"
                            self.secondary_tabs = ["Summer Internships", "Graduate Schemes"]
                            self.commentary = {
                                self.primary_tab: ("Because you have previous experience, you will be a strong candidate for "
                                                  "off-cycle internships. These programmes have less applicants and are suitable "
                                                  "for upcoming graduates, often converting to a full-time position."),
                                "Summer Internships": ("You can become eligible for summer internships by writing \"Intended Master's Degree\" "
                                                       "on your resume. These programmes are less competitive and are a reliable route "
                                                       "into receiving a full-time offer."),
                                "Graduate Schemes": ("Graduate programmes are unrealistically competitive for most roles in finance. "
                                                   "You should still send applications for less competitive companies, but prioritise "
                                                   "off-cycle internships and summer internships.")
                            }
                        else:
                            # Final year with no experience and no offer
                            self.primary_tab = "Summer Internships"
                            self.secondary_tabs = ["Off-Cycle Internships", "Graduate Schemes"]
                            self.commentary = {
                                self.primary_tab: ("You can become eligible for summer internships by writing \"Intended Master's Degree\" "
                                                   "on your resume. These programmes are less competitive and are a reliable route into "
                                                   "receiving a full-time offer. Because you have no relevant experience, applying for "
                                                   "summer internships will give you the best chance of receiving an offer"),
                                "Graduate Schemes": ("Graduate programmes are unrealistically competitive for most roles in finance. "
                                                   "You should still send applications for smaller or less competitive companies, but "
                                                   "prioritise summer internships for the most competitive roles."),
                                "Off-Cycle Internships": ("You are eligible for off-cycle internships, but these these are typically "
                                                          "unattainable for those without relevant experience. You should still submit "
                                                          "applications where possible, but prioritise applying for summer internships.")
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
        if self.data.get('is_previous', False):
            return self.get_previous_step()
        
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
            
            # Calculate years until graduation
            current_year = datetime.now().year
            years_until_grad = graduation_year - current_year
            
            # For final year students (years_until_grad == 0) or students in at least 2nd year,
            # continue with spring weeks questions
            if year_of_study >= 2 or years_until_grad <= 0:
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
            # Calculate years until graduation
            current_year = datetime.now().year
            graduation_year = self.data.get('graduation_year')
            years_until_grad = graduation_year - current_year if graduation_year else None
            
            # Add proper handling for None values
            year_of_study = self.calculate_year_of_study()
            
            # Check if years_until_grad is None and year_of_study is None before comparing
            if years_until_grad == 0 or (year_of_study is not None and year_of_study >= 4):
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
    
        current_date = datetime.now()
        current_year = current_date.year
        current_month = current_date.month
    
        # In the academic calendar, if it's before September (months 1-8),
        # you're still in the previous academic year
        if current_month < 9:  # Before September
            academic_year = current_year - 1
        else:
            academic_year = current_year
    
        # Calculate the academic year difference
        year_of_study = (academic_year - start_year) + 1
    
        print(f"Start year: {start_year}, Current date: {current_date}")
        print(f"Current month: {current_month}, Using academic year: {academic_year}")
        print(f"Calculated year of study: {year_of_study}")
    
        # Store this in the data object
        self.data['year_of_study'] = year_of_study
    
        return year_of_study

    def validate_year_difference(self):
        start_year = self.data.get('start_year')
        graduation_year = self.data.get('graduation_year')
        
        if start_year and graduation_year:
            total_years = graduation_year - start_year
            if total_years < 1 or total_years > 7:
                return False
        return True

    def submit_survey(self):
        # Calculate year_of_study if needed - but use the proper academic calculation
        if self.data.get('start_year') and not self.data.get('year_of_study'):
            self.data['year_of_study'] = self.calculate_year_of_study()
        
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
    
    def get_previous_step(self):
        """Get the previous step based on current step"""
        current_step = self.data.get('current_step')
        
        # Define step sequence
        step_sequence = [0, 1, 2, 3, 4, 'internship_experience', 'grad_offer', 'final']
        
        # Define special cases
        special_cases = {
            'internship_experience': {
                True: 4,  # If they had spring weeks, go back to step 4
                False: 3  # If they didn't have spring weeks, go back to step 3
            },
            'grad_offer': 'internship_experience'  # Always go back to internship experience
        }
        
        # Handle special cases
        if current_step in special_cases:
            if isinstance(special_cases[current_step], dict):
                has_spring_weeks = self.data.get('has_spring_weeks')
                prev_step = special_cases[current_step].get(has_spring_weeks, 3)
            else:
                prev_step = special_cases[current_step]
        else:
            # Find current step in sequence and go back one
            try:
                idx = step_sequence.index(current_step)
                prev_step = step_sequence[max(0, idx - 1)]
            except (ValueError, IndexError):
                prev_step = 1
        
        print(f"Going back from {current_step} to {prev_step}")
        return self.get_step_question(prev_step)
