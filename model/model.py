# ============================================
# Autism Detection ML Model Training Script
# ============================================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from imblearn.over_sampling import SMOTE
import joblib


# ============================================
# 1. Load Dataset
# ============================================

df = pd.read_csv("autism_dataset.csv")
print("Dataset loaded:", df.shape)


# ============================================
# 2. Clean Known Data Quality Issues
# ============================================

# age has '?' and '383' (typo — likely 38) from dataset inspection
df['age'] = df['age'].replace({'?': np.nan, '383': '38'})
df['age'] = pd.to_numeric(df['age'], errors='coerce')

# relation has '?' entries
df['relation'] = df['relation'].replace('?', np.nan)

# Drop rows with any remaining nulls
df = df.dropna()
print("After cleaning:", df.shape)


# ============================================
# 3. Encode Categorical Columns
# ============================================

categorical_cols = df.select_dtypes(include=['object']).columns.tolist()

# Remove target before encoding
if 'Class/ASD' in categorical_cols:
    categorical_cols.remove('Class/ASD')

# Save encoders per column so predict.py can reuse them
encoders = {}
le = LabelEncoder()

for col in categorical_cols:
    df[col] = le.fit_transform(df[col].astype(str))
    encoders[col] = le

# Encode target
df['Class/ASD'] = (df['Class/ASD'] == 'YES').astype(int)


# ============================================
# 4. Features and Target
# ============================================

target_column = 'Class/ASD'
X = df.drop(target_column, axis=1)
y = df[target_column]

print("Feature columns:", X.columns.tolist())
print("Class distribution:\n", y.value_counts())


# ============================================
# 5. Scale + Save Scaler  (CRITICAL FIX)
#    Original code scaled X but never saved the scaler,
#    so predict.py was feeding unscaled data to the model.
# ============================================

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

joblib.dump(scaler, "scaler.joblib")
print("Scaler saved.")


# ============================================
# 6. Train / Test Split
# ============================================

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)


# ============================================
# 7. SMOTE to handle class imbalance (515 NO vs 189 YES)
# ============================================

smote = SMOTE(random_state=42)
X_train_sm, y_train_sm = smote.fit_resample(X_train, y_train)


# ============================================
# 8. Logistic Regression (baseline)
# ============================================

log_model = LogisticRegression(max_iter=1000)
log_model.fit(X_train_sm, y_train_sm)
y_pred_log = log_model.predict(X_test)

print("\nLogistic Regression")
print("Accuracy:", accuracy_score(y_test, y_pred_log))
print(classification_report(y_test, y_pred_log))


# ============================================
# 9. Random Forest
# ============================================

rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_sm, y_train_sm)
y_pred_rf = rf_model.predict(X_test)

print("\nRandom Forest")
print("Accuracy:", accuracy_score(y_test, y_pred_rf))
print(classification_report(y_test, y_pred_rf))


# ============================================
# 10. Save best model (Random Forest)
# ============================================

joblib.dump(rf_model, "autism_detection_model.joblib")
print("\nModel saved as autism_detection_model.joblib")
print("Scaler saved as scaler.joblib")
