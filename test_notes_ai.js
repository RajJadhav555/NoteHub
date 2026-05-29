
const apiKey = 'AIzaSyByeP-8M7OebVbIGa64GaZj1VVdMF_TOsg';
const model = 'gemini-2.5-flash';

async function testNotesAI() {
    console.log("Testing Notes AI Chat Endpoint logic manually...");
    
    // Simulate what the backend does
    const promptPayload = {
        contents: [{
            parts: [{
                text: "User Question: What notes are available?"
            }]
        }]
    };

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(promptPayload)
        });

        const data = await response.json();
        console.log("Status:", response.status);
        
        if (response.ok) {
            console.log("Success! Response snippet:", data.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 100));
        } else {
            console.error("Error:", JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("Test Failed:", e);
    }
}

testNotesAI();
