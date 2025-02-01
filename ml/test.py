import sys
import joblib
import os
import json

# Load models and vectorizer
script_dir = os.path.dirname(__file__)
vectorizer = joblib.load(os.path.join(script_dir, "text_vectorizer.pkl"))
priority_model = joblib.load(os.path.join(script_dir, "priority_model.pkl"))
department_model = joblib.load(os.path.join(script_dir, "department_model.pkl"))

# Check input text
if len(sys.argv) < 2:
    print(json.dumps({"error": "No input text provided"}))
    sys.exit(1)

input_text = sys.argv[1]

# Transform using vectorizer
input_vector = vectorizer.transform([input_text])

# Predict priority and department
priority_prediction = priority_model.predict(input_vector)[0]
department_prediction = department_model.predict(input_vector)[0]

# Print the result as JSON (must match the expected format)
result = {
    "priority": priority_prediction,
    "department": department_prediction
}
print(json.dumps(result))
