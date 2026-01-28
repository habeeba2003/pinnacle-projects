# main.py
import os
import cv2
import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib

dataset_path = 'train'

labels = []
features = []

hog = cv2.HOGDescriptor()

def extract_features(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return None
    img = cv2.resize(img, (64, 128))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h = hog.compute(gray)
    return h.flatten()

print("Extracting features from images...")
for label in os.listdir(dataset_path):
    label_folder = os.path.join(dataset_path, label)
    if not os.path.isdir(label_folder):
        continue
    for file in os.listdir(label_folder):
        file_path = os.path.join(label_folder, file)
        feature = extract_features(file_path)
        if feature is not None:
            features.append(feature)
            labels.append(label)

features = np.array(features)
labels = np.array(labels)

label_encoder = LabelEncoder()
encoded_labels = label_encoder.fit_transform(labels)

X_train, X_test, y_train, y_test = train_test_split(features, encoded_labels, test_size=0.2, random_state=42)

print("Training model...")
model = SVC(kernel='linear', probability=True)
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Test Accuracy: {accuracy * 100:.2f}%")

joblib.dump(model, 'sports_model.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl')
print("Model and label encoder saved successfully.")
