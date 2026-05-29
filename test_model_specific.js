
const apiKey = 'AIzaSyByeP-8M7OebVbIGa64GaZj1VVdMF_TOsg';
async function test() {
    const model = 'gemini-2.5-flash';
    console.log(`Testing ${model}...`);
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
        });
        const data = await response.json();
        console.log("Status:", response.status);
        if(!response.ok) {
             console.log("Error:", JSON.stringify(data, null, 2));
        } else {
             console.log("Success!");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
