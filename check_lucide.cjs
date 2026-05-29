
const lucide = require('lucide-react');
console.log('Lucide Version:', require('lucide-react/package.json').version);
console.log('Available Icons:', Object.keys(lucide).filter(key => key !== 'icons').join(', '));
