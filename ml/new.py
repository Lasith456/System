import sys
import joblib
import os
import json
import numpy as np
from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler, LabelEncoder
import pandas as pd  # Add at the top if not already imported
# Load models and preprocessing objects
script_dir = os.path.dirname(__file__)
vectorizer = joblib.load(os.path.join(script_dir, "tfidf_vectorizer.pkl"))
priority_model = joblib.load(os.path.join(script_dir, "random_forest_priority_model.pkl"))
department_model = joblib.load(os.path.join(script_dir, "random_forest_department_model.pkl"))
scaler = joblib.load(os.path.join(script_dir, "scaler.pkl"))
department_encoder = joblib.load(os.path.join(script_dir, "department_encoder.pkl"))
target_encoder = joblib.load(os.path.join(script_dir, "target_encoder.pkl"))

# Check input text
if len(sys.argv) < 2:
    print(json.dumps({"error": "No input text provided"}))
    sys.exit(1)

input_text = sys.argv[1]

# Transform using vectorizer
input_vector = vectorizer.transform([input_text])

# Predict department
predicted_department_index = department_model.predict(input_vector)[0]

# Ensure department is valid
if predicted_department_index >= len(department_encoder.classes_):
    print(f"Warning: Predicted department index {predicted_department_index} out of range. Assigning default.")
    predicted_department_index = 0  # Assign default department

department_label = department_encoder.classes_[predicted_department_index]

# Encode department for priority prediction (Ensure it has correct feature shape)
department_encoded = np.array(department_encoder.transform([department_label])).reshape(-1, 1)

# Create DataFrame with feature names if needed
department_df = pd.DataFrame(department_encoded, columns=["Deparment"])

# Ensure StandardScaler is applied correctly
department_scaled = scaler.transform(department_df)

# Combine features for priority classification
X_priority_input = hstack((input_vector, department_scaled))

# Predict priority
priority_prediction = priority_model.predict(X_priority_input)[0]
priority_label = target_encoder.inverse_transform([priority_prediction])[0]

# Print the result as JSON
result = {
    "priority": priority_label,
    "department": department_label
}
print(json.dumps(result))
