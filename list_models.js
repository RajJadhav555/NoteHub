
const apiKey = 'AIzaSyAanMbbyE9zwTRDt9rKk-e1fJkEM1HiQio';
async function list() {
    console.log("Listing Models...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log("Status:", response.status);
        if (data.models) {
             console.log("Available Models:");
             data.models.forEach(m => {
                 if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                     console.log(`- ${m.name} (${m.displayName})`);
                 }
             });
        } else {
             console.log("Response:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
list();
