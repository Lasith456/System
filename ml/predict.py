import sys
import joblib
import os


script_dir = os.path.dirname(__file__)


model_path = os.path.join(script_dir, 'svm_model.pkl')
vectorizer_path = os.path.join(script_dir, 'vectorizer.pkl')

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)


input_text = sys.argv[1]


input_vector = vectorizer.transform([input_text])

prediction = model.predict(input_vector)


print(prediction[0])
