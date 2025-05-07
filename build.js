const fs = require('fs');
const path = require('path');

// Read the ideas.js file
const ideasJsPath = path.join(__dirname, 'ideas', 'ideas.js');
let content = fs.readFileSync(ideasJsPath, 'utf8');

// Replace environment variables
content = content.replace('SUPABASE_URL', process.env.SUPABASE_URL);
content = content.replace('SUPABASE_KEY', process.env.SUPABASE_KEY);

// Write the modified content back
fs.writeFileSync(ideasJsPath, content);

console.log('Build completed successfully!'); 