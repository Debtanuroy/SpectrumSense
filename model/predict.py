import sys
import json
import joblib
import numpy as np
import os

model_path  = os.path.join(os.path.dirname(__file__), "autism_detection_model.joblib")
scaler_path = os.path.join(os.path.dirname(__file__), "scaler.joblib")

model = joblib.load(model_path)

scaler = None
if os.path.exists(scaler_path):
    scaler = joblib.load(scaler_path)

features   = json.loads(sys.argv[1])
input_data = np.array(features).reshape(1, -1)

if scaler is not None:
    input_data = scaler.transform(input_data)

prediction   = model.predict(input_data)[0]
probability  = model.predict_proba(input_data)[0]   # [prob_NO, prob_YES]

prob_yes     = round(float(probability[1]) * 100, 2)  # percentage 0-100
prob_no      = round(float(probability[0]) * 100, 2)

if prob_yes >= 70:
    risk_level = "high"
elif prob_yes >= 40:
    risk_level = "moderate"
else:
    risk_level = "low"

result = {
    "prediction":  "Autism Likely" if prediction == 1 else "Autism Not Likely",
    "predicted":   int(prediction),          # 1 or 0
    "percentage":  prob_yes,                 # probability of ASD in %
    "prob_no":     prob_no,
    "risk_level":  risk_level,               # "low" | "moderate" | "high"
}

print(json.dumps(result))
