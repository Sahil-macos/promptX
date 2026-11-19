from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import tempfile
from pathlib import Path

# Add the source and model directories so the API works from any checkout path.
PROJECT_ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = PROJECT_ROOT / 'src'
MODELS_DIR = PROJECT_ROOT / 'models'
sys.path.insert(0, str(MODELS_DIR))
sys.path.insert(0, str(SOURCE_DIR))

from pdf_processing.input_handler import handle_input
from model1.security_gateway import security_check
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load evaluation metrics
EVALUATION_FILE = "evaluate/gateway_evaluation_results.csv"
METRICS_FILE = "model1/saved_model/metrics.json"

@app.route('/api/analyze', methods=['POST'])
def analyze_input():
    """Analyze text input for prompt injection"""
    try:
        import time
        data = request.json
        input_type = data.get('type')
        input_data = data.get('data')

        if not input_type or not input_data:
            return jsonify({'error': 'Missing input type or data'}), 400

        # Process input
        processed_input = handle_input(input_type, input_data)

        # Security check with timing
        start_time = time.time()
        result = security_check(processed_input)
        gateway_time_ms = (time.time() - start_time) * 1000

        # Map security gateway result to frontend format
        mapped_result = {
            'final_decision': result.get('final_decision'),
            'model1_risk_score': result.get('model1_risk') * 100 if result.get('model1_risk') else 0,
            'model1_prediction': result.get('mvnet_prediction'),
            'policy_score': result.get('policy_score'),
            'model2_triggered': result.get('model2_used', False),
            'model2_prediction': result.get('model2_prediction'),
            'model2_malicious_prob': result.get('model2_malicious_probability'),
            'gateway_time_ms': gateway_time_ms,
            'mvnet_score': result.get('mvnet_score'),
            'policy_decision': result.get('policy_decision'),
            'matched_rules': result.get('matched_rules', []),
            'routing': result.get('routing'),
            'final_label': result.get('final_label'),
            'llm_response': result.get('llm_response')
        }

        return jsonify({
            'success': True,
            'result': mapped_result
        })
    except Exception as e:
        import traceback
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500


@app.route('/api/analyze-pdf', methods=['POST'])
def analyze_pdf():
    """Analyze PDF file for prompt injection"""
    try:
        import time

        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'File must be a PDF'}), 400

        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            tmp_path = tmp_file.name

        try:
            # Process input using the temporary file path
            processed_input = handle_input('pdf', tmp_path)

            # Check if processed input is empty
            if not processed_input or len(processed_input.strip()) == 0:
                return jsonify({'error': 'No extractable text found in PDF. The PDF may be scanned images or empty.'}), 400

            # Truncate if too long for the model
            if len(processed_input) > 10000:
                processed_input = processed_input[:10000]

            # Security check with timing
            start_time = time.time()
            result = security_check(processed_input)
            gateway_time_ms = (time.time() - start_time) * 1000

            # Map security gateway result to frontend format
            mapped_result = {
                'final_decision': result.get('final_decision'),
                'model1_risk_score': result.get('model1_risk') * 100 if result.get('model1_risk') else 0,
                'model1_prediction': result.get('mvnet_prediction'),
                'policy_score': result.get('policy_score'),
                'model2_triggered': result.get('model2_used', False),
                'model2_prediction': result.get('model2_prediction'),
                'model2_malicious_prob': result.get('model2_malicious_probability'),
                'gateway_time_ms': gateway_time_ms,
                'mvnet_score': result.get('mvnet_score'),
                'policy_decision': result.get('policy_decision'),
                'matched_rules': result.get('matched_rules', []),
                'routing': result.get('routing'),
                'final_label': result.get('final_label'),
                'llm_response': result.get('llm_response')
            }

            return jsonify({
                'success': True,
                'result': mapped_result
            })
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        import traceback
        return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    """Get evaluation metrics for the security gateway"""
    try:
        # Current evaluation results from README
        metrics = {
            'accuracy': 95.75,
            'precision': 97.41,
            'recall': 95.29,
            'f1_score': 96.34,
            'confusion_matrix': {
                'true_negatives': 376,
                'false_positives': 14,
                'false_negatives': 26,
                'true_positives': 526
            },
            'routing': {
                'allow_decisions': 402,
                'block_decisions': 540,
                'model2_triggered': 548,
                'model2_trigger_rate': 58.17,
                'avg_gateway_time_ms': 10.84
            },
            'test_samples': 942
        }
        
        return jsonify(metrics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
