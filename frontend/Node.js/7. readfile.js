import fs from 'fs';
fs.readFile('8_message.txt', 'utf8', (err,data) =>{
  if(err) throw err;
  console.log("📖 File Content:", data);
})