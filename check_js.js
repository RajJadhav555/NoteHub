fetch('https://notehub-steel.vercel.app/assets/index-BqyiU-NE.js')
  .then(res => res.text())
  .then(text => {
    // Look for where fetch is called with notesAPI or similar
    const matches = text.match(/fetch\([^)]+\)/g);
    if(matches) {
       console.log(matches.slice(0, 15));
    }
    const hfMatches = text.match(/https:\/\/rajdjadhav-notehub-backend.hf.space[^'"]+/g);
    console.log("HF URL matches:", hfMatches);
  });
