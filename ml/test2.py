from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from scipy.sparse import hstack
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler, LabelEncoder

# Initialize FastAPI
app = FastAPI()

# Load saved models and preprocessing objects
priority_model = joblib.load("xgboost_priority_model.pkl")
department_model = joblib.load("xgboost_department_model.pkl")
tfidf_vectorizer = joblib.load("tfidf_vectorizer.pkl")
scaler = joblib.load("scaler.pkl")
department_encoder = joblib.load("department_encoder.pkl")
target_encoder = joblib.load("target_encoder.pkl")

# Ensure department_encoder has known labels
department_list = department_encoder.classes_

# Define request model
class PredictionRequest(BaseModel):
    text: str

@app.post("/predict")
def predict_priority(request: PredictionRequest):
    """Predicts priority and department based on input text."""
    try:
        # Process input text using TF-IDF
        text_tfidf = tfidf_vectorizer.transform([request.text])

        # Predict department
        predicted_department_index = department_model.predict(text_tfidf)[0]

        # Ensure department is valid
        if predicted_department_index >= len(department_list):
            print(f"Warning: Predicted department index {predicted_department_index} out of range. Assigning default.")
            predicted_department_index = 0  # Default to the first known department

        department_label = department_list[predicted_department_index]

        # Encode department properly for priority prediction
        department_encoded = department_encoder.transform([department_label]).reshape(-1, 1)
        department_scaled = scaler.transform(department_encoded)

        # Combine features for priority classification
        X_priority_input = hstack((text_tfidf, department_scaled))

        # Predict priority
        priority_prediction = priority_model.predict(X_priority_input)[0]
        priority_label = target_encoder.inverse_transform([priority_prediction])[0]

        # Debugging Output
        print(f"Input Text: {request.text}")
        print(f"Predicted Department: {department_label}")
        print(f"Predicted Priority: {priority_label}")

        return {
            "priority": priority_label,
            "department": department_label
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
