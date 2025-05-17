from flask import Flask, request, jsonify
from flask_cors import CORS
from survey_processor import SurveyProcessor
from typing import Dict, Any
import logging

# Constants
HTTP_OK = 200
HTTP_BAD_REQUEST = 400

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/api/survey/step', methods=['POST'])
def survey_step() -> Dict[str, Any]:
    """Handle survey step progression by returning the next step information."""
    data = request.get_json(silent=True)
    if not data:
        logger.error("No input data provided for survey step")
        return jsonify({"error": "No input data provided"}), HTTP_BAD_REQUEST

    try:
        processor = SurveyProcessor(data)
        next_step_info = processor.get_next_step()
        return jsonify(next_step_info), HTTP_OK
    except Exception as e:
        logger.error(f"Error processing survey step: {str(e)}")
        return jsonify({"error": f"Failed to process survey step: {str(e)}"}), HTTP_BAD_REQUEST

@app.route('/api/survey/submit', methods=['POST'])
def survey_submit() -> Dict[str, Any]:
    """Process and submit survey data, returning eligibility recommendations."""
    data = request.get_json(silent=True)
    if not data:
        logger.error("No input data provided for survey submission")
        return jsonify({"error": "No input data provided"}), HTTP_BAD_REQUEST

    try:
        processor = SurveyProcessor(data)
        calculated_yos = processor.calculate_year_of_study()
        logger.info(
            f"Survey submission processed - Calculated year_of_study: {calculated_yos}, "
            f"Provided: {data.get('year_of_study')}, "
            f"Education stage: {data.get('education_stage')}"
        )
        
        result = processor.process()
        return jsonify(result), HTTP_OK
    except Exception as e:
        logger.error(f"Error processing survey submission: {str(e)}")
        return jsonify({"error": f"Failed to process survey submission: {str(e)}"}), HTTP_BAD_REQUEST

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)