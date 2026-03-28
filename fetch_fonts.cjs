const https = require('https');
https.get('https://sc.jny.sch.id/_next/static/css/65d02d41c43e0362.css', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data.match(/font-family:[^;]+/g));
  });
});
