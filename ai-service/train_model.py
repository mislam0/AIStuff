import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

# Training data
# Features: motion, brightness, audio
X = np.array([
    [0.1, 0.2, 0.1],
    [0.9, 0.8, 0.7],
    [0.8, 0.7, 0.6],
    [0.2, 0.1, 0.2],
    [0.7, 0.9, 0.8],
    [0.3, 0.2, 0.1]
])

# Labels: 1 = highlight, 0 = not highlight
y = np.array([0, 1, 1, 0, 1, 0])

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "highlight_model.pkl")

print("Model trained and saved!")