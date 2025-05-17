# Trackr - Career Recommendation System

Trackr is a web application designed to help university students find career opportunities that match their current stage in education and experience level. The system recommends opportunities like Spring Weeks, Industrial Placements, Summer Internships, or Graduate Schemes based on a personalized survey.

## Project Structure
```
trackr/
├── backend/           # Flask API backend
│   ├── app.py         # Main Flask application 
│   ├── survey_processor.py  # Survey logic implementation
│   └── requirements.txt     # Python dependencies
├── frontend/          # Angular web application
│   ├── src/           # Source code
│   │   ├── app/       # Angular components
│   │   ├── index.html # Main HTML template
│   │   └── ...
│   ├── angular.json   # Angular configuration
│   └── ...
└── README.md          # This file
```

## Features
- **Dynamic Survey**: Adapts questions based on previous answers
- **Personalized Recommendations**: Tailors career suggestions to your academic stage
- **Academic Year Calculation**: Accounts for university scheduling when determining year of study
- **Detailed Commentary**: Provides rationale for each recommendation
  
## Getting Started

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create and activate a virtual environment:
   ```
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```
   python app.py
   ```
   The backend API will be available at http://127.0.0.1:5000.

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```  
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   ng serve
   ```
4. Open your browser and navigate to http://localhost:4200

## API Endpoints
- `POST /api/survey`: Submit the complete survey data and receive career recommendations
- `POST /api/survey/step`: Get the next question based on current survey progress

## Survey Flow
1. **Education Stage**: High School, University, or Graduate
2. **University Timeline**: Start year, graduation year, placement options
3. **Spring Weeks**: Experience with Spring Week programs (for Year 2+)
4. **Internship Experience**: Previous internship experience
5. **Graduate Offer**: Current graduate job offers (for final year students)

## Recommendation Logic
The system generates recommendations based on factors including:
- Current year of study (calculated using academic years)
- Time until graduation
- Previous experience with Spring Weeks or internships
- Graduate offers
- Industrial placement options

## Technology Stack
- **Frontend**: Angular 19
- **Backend**: Flask (Python)
- **API**: RESTful JSON API
- **Styling**: Custom CSS

## Development
To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request