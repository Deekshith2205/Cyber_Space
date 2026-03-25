// Uses native fetch
(async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: "anjankumarln120@gmail.com", password: "Anjan#123" })
        });
        const data = await response.json();
        console.log("Status Code:", response.status);
        console.log("Response Body:", data);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
})();
