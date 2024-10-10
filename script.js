document.getElementById('emergencyBtn').addEventListener('click', () => {
    const bp = document.getElementById('bp').value;
    const bloodSugar = document.getElementById('bloodSugar').value;
    const heartRate = document.getElementById('heartRate').value;
    const symptoms = document.getElementById('symptoms').value;

    // Post the data to the server
    fetch('/send-sms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bp, bloodSugar, heartRate, symptoms }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
