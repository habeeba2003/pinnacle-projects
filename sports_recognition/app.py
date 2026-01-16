# app.py
from flask import Flask, render_template, request
import os
import cv2
import numpy as np
import joblib

app = Flask(__name__)

# Load model and label encoder
model = joblib.load('sports_model.pkl')
label_encoder = joblib.load('label_encoder.pkl')

# Ensure upload directory exists
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return render_template('index.html', prediction="No image uploaded")

    img_file = request.files['image']
    if img_file.filename == '':
        return render_template('index.html', prediction="No selected file")

    filename = img_file.filename
    img_path = os.path.join(UPLOAD_FOLDER, filename)
    img_file.save(img_path)

    def extract_features(image_path):
        img = cv2.imread(image_path)
        img = cv2.resize(img, (64, 128))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        hog = cv2.HOGDescriptor()
        h = hog.compute(gray)
        return h.flatten()

    features = extract_features(img_path).reshape(1, -1)

    if features.shape[1] != model.support_vectors_.shape[1]:
        return render_template('index.html', prediction="Feature size mismatch. Use clear sports image.")

    prediction = model.predict(features)
    result = label_encoder.inverse_transform(prediction)[0]

    # Convert path for HTML
    image_path_for_html = f"/{img_path.replace(os.sep, '/')}"
    return render_template('index.html', prediction=result, image_path=image_path_for_html)

if __name__ == '__main__':
    app.run(debug=True)
