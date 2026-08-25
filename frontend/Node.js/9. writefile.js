import fs from 'fs';

fs.writeFile('8_message.txt', 'I am a React.js developer!', (err) => {
  if (err) throw err;
  console.log('✅ File has been saved!');
});