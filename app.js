document.getElementById('anemia-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const age = document.getElementById('age').value;
    const language = document.getElementById('language').value;
    const symptoms = Array.from(document.getElementById('symptoms').selectedOptions).map(option => option.value);
    const nailPhoto = document.getElementById('nail-photo').files[0];
    const eyePhoto = document.getElementById('eye-photo').files[0];

    if (!nailPhoto || !eyePhoto) {
        alert('Please upload both photos / దయచేసి రెండు ఫోటోలను అప్లోడ్ చేయండి.');
        return;
    }

    const formData = new FormData();
    formData.append('age', age);
    formData.append('nail_photo', nailPhoto);
    formData.append('eye_photo', eyePhoto);
    formData.append('symptoms', symptoms.join(','));

    try {
        // Send data to your server or ML model API
        const response = await fetch('https://your-ml-model-api.com/detect-anemia', {
            method: 'POST',
            body: formData
        });
        const imgTensor = preprocessImage(nailPhoto);
        const prediction = model.predict(imgTensor);
        const model = await tf.loadLayersModel('/path/to/tfjs_model/model.json');

        const data = await response.json();

        // Handle result
        const isAnemic = data.isAnemic;
        const hemoglobinRange = data.hemoglobinRange;

        document.getElementById('diagnosis').innerText = isAnemic
            ? language === 'en' ? 'Anemic' : 'అనీమియా'
            : language === 'en' ? 'Not Anemic' : 'అనీమియా లేదు';
        
        document.getElementById('hemoglobin-range').innerText = `${language === 'en' ? 'Hemoglobin Range' : 'హిమోగ్లోబిన్ శ్రేణి'}: ${hemoglobinRange}`;

        // Display anemia info
        document.getElementById('anemia-description').innerText = isAnemic
            ? language === 'en' 
                ? "Anemia is a condition where the blood lacks enough healthy red blood cells or hemoglobin."
                : "అనీమియా అనేది రక్తంలో పుష్కలమైన ఆరోగ్యకరమైన ఎర్ర రక్త కణాలు లేదా హిమోగ్లోబిన్ లోపించడం."
            : "";

        // Symptoms, foods, and exercises lists
        displayList('symptoms-list', language === 'en'
            ? ["Fatigue", "Pale Skin", "Shortness of Breath", "Dizziness"]
            : ["అలసట", "వర్ణం మారడం", "పిలపి", "తలనొప్పి"]);

        displayList('food-list', language === 'en'
            ? ["Leafy greens", "Red meat", "Lentils", "Beetroot", "Iron-rich foods"]
            : ["ఆకు కూరలు", "ఎర్ర మాంసం", "పప్పులు", "బీట్‌రూట్", "ఇనుప ఎక్కువగా ఉన్న ఆహారం"]);

        displayList('exercise-list', language === 'en'
            ? ["Walking", "Yoga", "Breathing exercises"]
            : ["నడక", "యోగ", "శ్వాస వ్యాయామాలు"]);

    } catch (error) {
        console.error('Error detecting anemia:', error);
    }
});

function displayList(elementId, items) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = "";
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        listElement.appendChild(listItem);
    });
    

}