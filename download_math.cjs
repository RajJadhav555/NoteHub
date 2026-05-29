const https = require('https');
const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\9b730460-2582-4d4d-82b4-81f84e17f7c4\\artifacts\\';

const equations = [
  {
    name: 'math_acq',
    latex: '\\dpi{300} \\bg{white} D_{hash}(N) = \\text{sgn} \\left( \\sum_{i=1}^{k} w_i \\cdot h(f_i) \\right)'
  },
  {
    name: 'math_cond',
    latex: '\\dpi{300} \\bg{white} \\text{If } J(A, B) = \\frac{|A \\cap B|}{|A \\cup B|} > 0.40 \\; \\lor \\; \\sum_{k=1}^{64} (H_A[k] \\oplus H_B[k]) \\le 3 \\implies \\text{Reject}'
  },
  {
    name: 'math_gam',
    latex: '\\dpi{300} \\bg{white} U_{points}(t+1) = U_{points}(t) + \\lfloor 10 \\times (1 + 0.1 \\cdot I_{\\text{verif}}) \\rfloor'
  },
  {
    name: 'math_alert',
    latex: '\\dpi{300} \\bg{white} A(t) = \\begin{cases} 1 & \\text{if } J(A,B) > 0.40 \\; \\lor \\; D_{\\text{Ham}} \\le 3 \\\\ 0 & \\text{otherwise} \\end{cases}'
  },
  {
    name: 'math_sys',
    latex: '\\dpi{300} \\bg{white} S = \\{I, P, O\\} \\text{ where } I=\\text{Inputs}, \\; P=\\text{Processes}, \\; O=\\text{Outputs}'
  }
];

function downloadEquation(eq) {
  const encoded = encodeURIComponent(eq.latex);
  const url = 'https://latex.codecogs.com/png.image?' + encoded;
  const destPath = path.join(artifactDir, eq.name + '.png');
  
  https.get(url, (res) => {
    const dest = fs.createWriteStream(destPath);
    res.pipe(dest);
    dest.on('finish', () => {
      console.log('Downloaded ' + eq.name + '.png');
    });
  }).on('error', (err) => {
    console.log('Error downloading ' + eq.name + ' - ' + err.message);
  });
}

equations.forEach(downloadEquation);
