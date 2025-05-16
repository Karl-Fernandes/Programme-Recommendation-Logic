#!/bin/python
from flask import Flask, request, jsonify
from flask_cors import CORS
from survey_processor import SurveyProcessor  # the class above in survey_processor.py

app = Flask(__name__)
CORS(app) 

@app.route('/api/survey', methods=['POST'])  # Python decorator, when we go to this endpoint, the survey function will execute
def survey():
    data = request.json
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    processor = SurveyProcessor(data)
    result = processor.process()
    
    return jsonify(result), 200

@app.route('/api/survey/step', methods=['POST'])
def survey_step():
    data = request.json
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    processor = SurveyProcessor(data)
    next_step_info = processor.get_next_step()
    
    return jsonify(next_step_info), 200

@app.route('/api/survey/submit', methods=['POST'])
def survey_submit():
    data = request.json
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    processor = SurveyProcessor(data)
    result = processor.process()
    
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True)
