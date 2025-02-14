from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from flask_cors import CORS  # To handle CORS issues with React



# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load dataset
crop = pd.read_csv('Crop_recommendation.csv')

# Drop unnecessary columns
crop = crop.drop(columns=['N', 'P', 'K'])

# Encode labels
le = LabelEncoder()
crop['label'] = le.fit_transform(crop['label'])

# Split dataset into features and target
X = crop.drop('label', axis=1)
y = crop['label']

# Split dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.2f}")

# Crop dictionary for mapping label indexes to crop names
crop_dict = {1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya", 7: "Orange",
             8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes", 12: "Mango", 13: "Banana",
             14: "Pomegranate", 15: "Lentil", 16: "Blackgram", 17: "Mungbean", 18: "Mothbeans",
             19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"}

# Function to predict crop based on input features
# def predict_crop(temperature, humidity, ph, rainfall):
#     input_data = np.array([[temperature, humidity, ph, rainfall]])
#     prediction = model.predict(input_data)[0]
#     predicted_crop_label = le.inverse_transform([prediction])[0]
#     return crop_dict[predicted_crop_label + 1]

# API Endpoint for prediction
@app.route('/predict', methods=['POST'])

def predict():
    try:
        data = request.get_json()
        print("Received Data:", data)  # Debugging log

        # Validate input data
        required_fields = ['temperature', 'humidity', 'ph', 'rainfall']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing input fields"}), 400

        # Convert input values to floats
        try:
            temperature = float(data['temperature'])
            humidity = float(data['humidity'])
            ph = float(data['ph'])
            rainfall = float(data['rainfall'])
        except ValueError:
            return jsonify({"error": "Invalid input values. Please enter numerical values."}), 400

        # Create DataFrame with correct feature names
        input_data = pd.DataFrame([[temperature, humidity, ph, rainfall]], columns=['temperature', 'humidity', 'ph', 'rainfall'])

        # Make prediction
        prediction = model.predict(input_data)[0]
        predicted_crop_label = le.inverse_transform([prediction])[0]
        print(predicted_crop_label)
        predicted_crop_name = predicted_crop_label

        return jsonify({"Prediction": predicted_crop_name})

    except Exception as e:
        import traceback
        print("Error Traceback:\n", traceback.format_exc())  # Print full error traceback
        return jsonify({"error": str(e)}), 500



# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
