const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'app', 'globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/--ink: #[0-9a-fA-F]+;/g, '--ink: #1f3b57;');
css = css.replace(/--ink-2: #[0-9a-fA-F]+;/g, '--ink-2: #152943;');
css = css.replace(/--ink-3: #[0-9a-fA-F]+;/g, '--ink-3: #5f6b76;');
css = css.replace(/--paper: #[0-9a-fA-F]+;/g, '--paper: #ffffff;');
css = css.replace(/--cream: #[0-9a-fA-F]+;/g, '--cream: #ebf1f7;');
css = css.replace(/--cream-2: #[0-9a-fA-F]+;/g, '--cream-2: #f2f5f5;');
css = css.replace(/--line: #[0-9a-fA-F]+;/g, '--line: #bfd2e3;');
css = css.replace(/--line-2: #[0-9a-fA-F]+;/g, '--line-2: #bfd2e3;');
css = css.replace(/--orange: #[0-9a-fA-F]+;/g, '--orange: #d9822b;');
css = css.replace(/--orange-deep: #[0-9a-fA-F]+;/g, '--orange-deep: #d9822b;');
css = css.replace(/--amber: #[0-9a-fA-F]+;/g, '--amber: #fbeddd;');
css = css.replace(/--pos: #[0-9a-fA-F]+;/g, '--pos: #2f8f4e;');
css = css.replace(/--neg: #[0-9a-fA-F]+;/g, '--neg: #b3261e;');
css = css.replace(/--neu: #[0-9a-fA-F]+;/g, '--neu: #0e7c7b;');

// Background body gradients in UMKM uses #d7e6f4 to #ebf1f7
css = css.replace(/#ffe7cc/g, '#d7e6f4');
css = css.replace(/rgba\(255, 231, 204, 0\)/g, 'rgba(215, 230, 244, 0)');
css = css.replace(/#fff6ec/g, '#d7e6f4');
css = css.replace(/#fffdfb/g, '#ebf1f7');

fs.writeFileSync(cssPath, css, 'utf8');
