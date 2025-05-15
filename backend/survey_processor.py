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
        # Extract needed fields (example keys)
        edu_stage = self.data.get('education_stage', '').lower()
        year_of_study = self.data.get('year_of_study', 0)  # integer e.g. 1, 2, 3, 4
        graduation_year = self.data.get('graduation_year', None)  # year e.g. 2025
        current_year = datetime.now().year 
        has_placement = self.data.get('has_placement', False)
        has_grad_offer = self.data.get('has_grad_offer', False)
        has_experience = self.data.get('has_experience', False)
        graduated = self.data.get('graduated', False)

        years_until_grad = graduation_year - current_year if graduation_year else None

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

        # Logic starts here

        if edu_stage == 'high school':
            self.primary_tab = "Pre-University"
            self.secondary_tabs = []
            self.commentary[self.primary_tab] = commentary_texts['Pre-University']

        elif edu_stage == 'pre-university':
            # This could be treated similar to high school?
            self.primary_tab = "Pre-University"
            self.secondary_tabs = []
            self.commentary[self.primary_tab] = commentary_texts['Pre-University']

        elif edu_stage == 'university':
            if graduated:
                # Graduated university logic
                if has_experience:
                    self.primary_tab = "Off-Cycle Internships"
                    self.secondary_tabs = ["Graduate Schemes"]
                    self.commentary[self.primary_tab] = commentary_texts['Graduated Exp']
                    self.commentary["Graduate Schemes"] = commentary_texts['Graduate Schemes']
                else:
                    self.primary_tab = "Graduate Schemes"
                    self.secondary_tabs = ["Off-Cycle Internships"]
                    self.commentary[self.primary_tab] = commentary_texts['Graduated No Exp']
                    self.commentary["Off-Cycle Internships"] = commentary_texts['Off-Cycle Internships']

            else:
                # Still studying
                if years_until_grad is None:
                    # missing info, fallback
                    self.primary_tab = "Spring Weeks"
                    self.secondary_tabs = []
                    self.commentary[self.primary_tab] = commentary_texts['Spring Weeks']
                elif years_until_grad > 2:
                    # More than 2 years out
                    if has_placement:
                        self.primary_tab = "Industrial Placements"
                        self.secondary_tabs = ["Spring Weeks"]
                        self.commentary[self.primary_tab] = commentary_texts['Industrial Placements']
                        self.commentary["Spring Weeks"] = commentary_texts['Spring Weeks']
                    else:
                        self.primary_tab = "Spring Weeks"
                        self.secondary_tabs = []
                        self.commentary[self.primary_tab] = commentary_texts['Spring Weeks']

                elif years_until_grad == 2:
                    # Two years out from graduation
                    if year_of_study == 2 and has_placement:
                        self.primary_tab = "Industrial Placements"
                        self.secondary_tabs = ["Off-Cycle Internships"]
                        self.commentary[self.primary_tab] = commentary_texts['Industrial Placements']
                        self.commentary["Off-Cycle Internships"] = commentary_texts['Off-Cycle Internships']
                    elif year_of_study == 3:
                        # Penultimate year
                        self.primary_tab = "Summer Internships"
                        self.secondary_tabs = ["Spring Weeks"]
                        self.commentary[self.primary_tab] = commentary_texts['Summer Internships']
                        self.commentary["Spring Weeks"] = commentary_texts['Spring Weeks']
                    elif year_of_study == 4:
                        # Final year - no grad offer logic assumed here
                        if has_grad_offer:
                            self.primary_tab = "Graduate Schemes"
                            self.secondary_tabs = ["Summer Internships", "Off-Cycle Internships"]
                            self.commentary[self.primary_tab] = commentary_texts['Graduate Schemes']
                            self.commentary["Summer Internships"] = commentary_texts['Summer Internships']
                            self.commentary["Off-Cycle Internships"] = commentary_texts['Off-Cycle Internships']
                        else:
                            if has_experience:
                                self.primary_tab = "Off-Cycle Internships"
                                self.secondary_tabs = ["Summer Internships", "Graduate Schemes"]
                                self.commentary[self.primary_tab] = commentary_texts['Final Year No Offer Exp']
                                self.commentary["Summer Internships"] = commentary_texts['Summer Internships']
                                self.commentary["Graduate Schemes"] = commentary_texts['Graduate Schemes']
                            else:
                                self.primary_tab = "Summer Internships"
                                self.secondary_tabs = ["Off-Cycle Internships", "Graduate Schemes"]
                                self.commentary[self.primary_tab] = commentary_texts['Final Year No Offer No Exp']
                                self.commentary["Graduate Schemes"] = commentary_texts['Graduate Schemes']
                                self.commentary["Off-Cycle Internships"] = commentary_texts['Off-Cycle Internships']
                    else:
                        # default fallback
                        self.primary_tab = "Spring Weeks"
                        self.secondary_tabs = []
                        self.commentary[self.primary_tab] = commentary_texts['Spring Weeks']

        else:
            # Default fallback
            self.primary_tab = "Pre-University"
            self.secondary_tabs = []
            self.commentary[self.primary_tab] = commentary_texts['Pre-University']

        return {
            "primary_tab": self.primary_tab,
            "secondary_tabs": self.secondary_tabs,
            "commentary": self.commentary
        }
