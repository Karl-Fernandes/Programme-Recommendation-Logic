"""
Survey Data Processor

This script processes user survey data, handling empty inputs gracefully.
Can be used as a backend for a web application by accepting JSON payloads.
"""

import json
from dataclasses import dataclass, field, asdict
from typing import Dict, Any, Optional
from datetime import datetime




@dataclass
class SurveyResponse:
    """Data class to store survey responses with default empty values."""
    
    # Personal information
    name: str = ""
    email: str = ""
    age: str = ""
    
    # Education details
    education_stage: str = ""  # e.g., "pre-university", "university", "graduated"
    institution: str = ""
    major: str = ""
    graduation_year: str = ""
    
    # Professional information
    employment_status: str = ""
    job_title: str = ""
    company: str = ""
    years_of_experience: str = ""
    
    # Additional fields
    interests: list = field(default_factory=list)
    feedback: str = ""
    
    # Metadata
    submission_timestamp: str = ""
    survey_version: str = "1.0"


class SurveyProcessor:
    """Processes survey responses and performs necessary operations."""
    
    def __init__(self):
        self.responses = []
    
    def process_input(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process the input data from the user or frontend.
        
        Args:
            data: Dictionary containing survey responses
            
        Returns:
            Dictionary with processing results and status
        """
        try:
            # Create a survey response object
            response = SurveyResponse()
            
            # Update fields from input data
            for key, value in data.items():
                if hasattr(response, key):
                    setattr(response, key, value)
            
            # Additional processing logic can be added here
            # For example, data validation, enrichment, etc.
            
            # Store the response
            self.responses.append(response)
            
            return {
                "status": "success",
                "message": "Survey response processed successfully",
                "response_id": len(self.responses),
                "processed_data": asdict(response)
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"Error processing survey response: {str(e)}"
            }
    
    def get_response(self, response_id: int) -> Optional[Dict[str, Any]]:
        """
        Retrieve a specific response by ID.
        
        Args:
            response_id: ID of the response to retrieve
            
        Returns:
            Response data as dictionary or None if not found
        """
        if 1 <= response_id <= len(self.responses):
            return asdict(self.responses[response_id - 1])
        return None
    
    def get_all_responses(self) -> list:
        """
        Retrieve all survey responses.
        
        Returns:
            List of all responses as dictionaries
        """
        return [asdict(response) for response in self.responses]
    
    def save_to_file(self, filename: str) -> Dict[str, Any]:
        """
        Save all responses to a JSON file.
        
        Args:
            filename: Name of the file to save to
            
        Returns:
            Status dictionary
        """
        try:
            with open(filename, 'w') as f:
                json.dump(self.get_all_responses(), f, indent=2)
            return {"status": "success", "message": f"Data saved to {filename}"}
        except Exception as e:
            return {"status": "error", "message": f"Error saving data: {str(e)}"}


def main():
    """Main function for command-line execution."""
    processor = SurveyProcessor()
    
    # Demo with manual input
    print("Survey Data Collection")
    print("=====================")
    print("(Leave any field blank if not applicable)")
    
    # Collect basic info
    data = {}
    data["name"] = input("Name: ")
    data["email"] = input("Email: ")
    data["age"] = input("Age: ")
    
    # Education
    data["education_stage"] = input(" What stage of education are you in? (pre-university/university/graduated): ")

    
    data["institution"] = input("Institution (if applicable): ")
    data["major"] = input("Major/Field of Study (if applicable): ")
    
    if data["education_stage"].lower() == "university":
        data["start_year"] = input("Undergraduate degree start year: ")
        data["graduation_year"] = input("Expected graduation year: ")
        has_placement = input("Do you have an industrial placement year in your course? (yes/no): ")
        data["has_industrial_placement"] = has_placement.lower() == 'yes'
        
        # Calculate current year of study based on start year
        try:
            start_year = int(data["start_year"])
            current_year = datetime.now().year
            year_of_study = current_year - start_year + 1
            data["year_of_study"] = year_of_study
            
            if year_of_study >= 2:
                spring_week = input("Have you completed any prior Spring Weeks? (yes/no): ")
                data["completed_spring_weeks"] = spring_week.lower() == 'yes'
                
                if spring_week.lower() == 'yes':
                    conversion = input("Did you convert any of these into a Summer Internship offer? (yes/no): ")
                    data["converted_to_internship"] = conversion.lower() == 'yes'
                
                internship = input("Have you completed any prior relevant Summer Internships or Full-Time work? (yes/no): ")
                data["completed_internships"] = internship.lower() == 'yes'
                
                # Check if final year
                try:
                    graduation_year = int(data["graduation_year"])
                    if graduation_year == current_year:
                        grad_offer = input("Do you have a graduate offer already? (yes/no): ")
                        data["has_graduate_offer"] = grad_offer.lower() == 'yes'
                except ValueError:
                    pass
        except ValueError:
            pass
            
    elif data["education_stage"].lower() == "graduated":
        internship = input("Have you completed any prior relevant Summer Internships or Full-Time work? (yes/no): ")
        data["completed_internships"] = internship.lower() == 'yes'
    
    # Removed duplicate university information collection
    # Employment
    data["employment_status"] = input("Employment Status: ")
    
    if data["employment_status"].lower() not in ["unemployed", "student"]:
        data["job_title"] = input("Job Title: ")
        data["company"] = input("Company: ")
        data["years_of_experience"] = input("Years of Experience: ")
    
    # Additional info
    interests = input("Interests (comma separated): ")
    if interests:
        data["interests"] = [i.strip() for i in interests.split(",")]
    
    data["feedback"] = input("Any additional feedback: ")
    
    # Process the collected data
    result = processor.process_input(data)
    print("\nProcessing Result:")
    print(json.dumps(result, indent=2))
    
    # Save to file option
    save = input("\nSave to file? (y/n): ")
    if save.lower() == 'y':
        filename = input("Enter filename (default: survey_responses.json): ") or "survey_responses.json"
        save_result = processor.save_to_file(filename)
        print(json.dumps(save_result, indent=2))


if __name__ == "__main__":
    main()