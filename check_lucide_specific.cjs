
const lucide = require('lucide-react');
const targetIcons = ['Save', 'TrendingUp', 'Filter', 'Scan', 'AlertTriangle', 'Loader2', 'Edit', 'Pen'];
targetIcons.forEach(icon => {
    console.log(`${icon}: ${lucide[icon] ? 'Found' : 'MISSING'}`);
});
