const { execSync } = require('child_process');

console.log('Staging all changes...');
execSync('git add -A', { stdio: 'inherit' });

try {
  execSync('git commit -m "deploy: update site"', { stdio: 'inherit' });
  console.log('Committed. Pushing...');
} catch {
  console.log('Nothing new to commit (or commit failed). Pushing existing commits...');
}

execSync('git push', { stdio: 'inherit' });
console.log('Done. If Cloudflare Pages is connected to this repo, the site will update in a minute.');
