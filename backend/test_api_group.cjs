async function testCreateGroup() {
  try {
    const res = await fetch('https://rajdjadhav-notehub-backend.hf.space/api/collaboration/groups', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "API Test Group Cloud",
        description: "Testing API",
        subject: "General",
        creatorId: 1, // Assume user 1 exists
      }),
    });
    console.log(res.status);
    console.log(await res.text());
  } catch (err) {
    console.error(err);
  }
}
testCreateGroup();
