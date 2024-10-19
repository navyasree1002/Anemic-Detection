from flask import Flask, request, jsonify
from your_ml_model import predict_anemia

app = Flask(__name__)

@app.route('/anemia-detection', methods=['POST'])
def detect_anemia():
    data = request.json
    age = data['age']
    symptoms = data['symptoms']
    nail_photo = data['nailPhoto']
    eye_photo = data['eyePhoto']

    # ML model inference
    diagnosis, hemoglobin_range = predict_anemia(nail_photo, eye_photo, symptoms, age)

    # Return results
    result = {
        "isAnemic": diagnosis == "Anemic",
        "hemoglobinRange": hemoglobin_range,
        "anemiaDescription": "Anemia is a condition where blood lacks healthy red blood cells.",
        "anemiaDescriptionTelugu": "అనీమియా అనేది రక్తంలో పుష్కలమైన ఎర్ర రక్త కణాలు లేదా హిమోగ్లోబిన్ లోపించడం.",
        "symptoms": ["Fatigue", "Pale skin", "Dizziness"],
        "foods": ["Leafy greens", "Red meat", "Lentils", "Beetroot", "Iron-rich foods"],
        "exercises": ["Walking", "Yoga", "Breathing exercises"]
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
