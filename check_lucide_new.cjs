
const lucide = require('lucide-react');
const targetIcons = ['ScanLine', 'TriangleAlert', 'LoaderCircle', 'CircleCheck', 'CheckCircle2', 'EyeClosed', 'EyeOff'];
targetIcons.forEach(icon => {
    console.log(`${icon}: ${lucide[icon] ? 'Found' : 'MISSING'}`);
});
