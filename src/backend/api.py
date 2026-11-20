
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import tempfile
import time
from pathlib import Path

# ============================================================
# PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = PROJECT_ROOT / "src"
MODELS_DIR = PROJECT_ROOT / "models"

sys.path.insert(0, str(MODELS_DIR))
sys.path.insert(0, str(SOURCE_DIR))

# ============================================================
# DOWNLOAD MODELS BEFORE IMPORTING SECURITY GATEWAY
# ============================================================

from model_downloader_demo import download_models

download_models()

# ============================================================
# IMPORT PROJECT MODULES
# ============================================================

from pdf_processing.input_handler import handle_input
from model1.security_gateway_demo import security_check

# ============================================================
# FLASK APPLICATION
# ============================================================

app = Flask(__name__)
CORS(app)

# Load evaluation metrics
EVALUATION_FILE = "evaluate/gateway_evaluation_results.csv"
METRICS_FILE = "model1/saved_model/metrics.json"


# ============================================================
# TEXT ANALYSIS API
# ============================================================

@app.route("/api/analyze", methods=["POST"])
def analyze_input():
    """Analyze text input for prompt injection"""

    try:
        data = request.json

        if not data:
            return jsonify({"error": "Invalid JSON input"}), 400

        input_type = data.get("type")
        input_data = data.get("data")

        if not input_type or not input_data:
            return jsonify({"error": "Missing input type or data"}), 400

        print("[DEBUG] Starting input preprocessing...", flush=True)
        preprocess_start = time.time()

        processed_input = handle_input(input_type, input_data)

        print(
            f"[DEBUG] Input preprocessing: {time.time() - preprocess_start:.3f}s",
            flush=True
        )

        start_time = time.time()
        result = security_check(processed_input)
        gateway_time_ms = (time.time() - start_time) * 1000

        mapped_result = {
            "final_decision": result.get("final_decision"),
            "model1_risk_score": result.get("model1_risk") * 100 if result.get("model1_risk") else 0,
            "model1_prediction": result.get("mvnet_prediction"),
            "policy_score": result.get("policy_score"),
            "model2_triggered": result.get("model2_used", False),
            "model2_prediction": result.get("model2_prediction"),
            "model2_malicious_prob": result.get("model2_malicious_probability"),
            "gateway_time_ms": gateway_time_ms,
            "mvnet_score": result.get("mvnet_score"),
            "policy_decision": result.get("policy_decision"),
            "matched_rules": result.get("matched_rules", []),
            "routing": result.get("routing"),
            "final_label": result.get("final_label"),
            "llm_response": result.get("llm_response")
        }

        return jsonify({
            "success": True,
            "result": mapped_result
        })

    except Exception as e:
        import traceback
        return jsonify({
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500


# ============================================================
# PDF ANALYSIS API
# ============================================================

@app.route("/api/analyze-pdf", methods=["POST"])
def analyze_pdf():
    """Analyze PDF file for prompt injection"""

    try:
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"error": "File must be a PDF"}), 400

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            file.save(tmp_file.name)
            tmp_path = tmp_file.name

        try:
            processed_input = handle_input("pdf", tmp_path)

            if not processed_input or len(processed_input.strip()) == 0:
                return jsonify({
                    "error": "No extractable text found in PDF. The PDF may be scanned images or empty."
                }), 400

            if len(processed_input) > 10000:
                processed_input = processed_input[:10000]

            start_time = time.time()
            result = security_check(processed_input)
            gateway_time_ms = (time.time() - start_time) * 1000

            mapped_result = {
                "final_decision": result.get("final_decision"),
                "model1_risk_score": result.get("model1_risk") * 100 if result.get("model1_risk") else 0,
                "model1_prediction": result.get("mvnet_prediction"),
                "policy_score": result.get("policy_score"),
                "model2_triggered": result.get("model2_used", False),
                "model2_prediction": result.get("model2_prediction"),
                "model2_malicious_prob": result.get("model2_malicious_probability"),
                "gateway_time_ms": gateway_time_ms,
                "mvnet_score": result.get("mvnet_score"),
                "policy_decision": result.get("policy_decision"),
                "matched_rules": result.get("matched_rules", []),
                "routing": result.get("routing"),
                "final_label": result.get("final_label"),
                "llm_response": result.get("llm_response")
            }

            return jsonify({
                "success": True,
                "result": mapped_result
            })

        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        import traceback
        return jsonify({
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500


# ============================================================
# METRICS API
# ============================================================

@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    """Get evaluation metrics for the security gateway"""

    try:
        metrics = {
            "accuracy": 95.75,
            "precision": 97.41,
            "recall": 95.29,
            "f1_score": 96.34,
            "confusion_matrix": {
                "true_negatives": 376,
                "false_positives": 14,
                "false_negatives": 26,
                "true_positives": 526
            },
            "routing": {
                "allow_decisions": 402,
                "block_decisions": 540,
                "model2_triggered": 548,
                "model2_trigger_rate": 58.17,
                "avg_gateway_time_ms": 10.84
            },
            "test_samples": 942
        }

        return jsonify(metrics)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# HEALTH CHECK API
# ============================================================

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})


# ============================================================
# LOCAL DEVELOPMENT
# ============================================================

if __name__ == "__main__":
    app.run(debug=True, port=5001)
