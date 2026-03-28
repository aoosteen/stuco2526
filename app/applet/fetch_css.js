import https from 'https';

https.get('https://sc.jny.sch.id/_next/static/css/2eace407a8f94008.css', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
