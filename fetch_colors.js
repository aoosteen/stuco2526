const https = require('https');

https.get('https://sc.jny.sch.id/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const cssLinks = [...data.matchAll(/href=\"([^\"]+\.css[^\"]*)\"/g)].map(m => m[1]);
    console.log('CSS Links:', cssLinks);
    
    // Extract inline colors
    const hexColors = data.match(/#[0-9a-fA-F]{3,6}/g) || [];
    const rgbColors = data.match(/rgba?\([^)]+\)/g) || [];
    console.log('Inline Hex:', [...new Set(hexColors)]);
    console.log('Inline RGB:', [...new Set(rgbColors)]);

    // Fetch the first CSS file to see colors
    if (cssLinks.length > 0) {
      let cssUrl = cssLinks[0];
      if (!cssUrl.startsWith('http')) {
        cssUrl = 'https://sc.jny.sch.id' + (cssUrl.startsWith('/') ? '' : '/') + cssUrl;
      }
      https.get(cssUrl, (cssRes) => {
        let cssData = '';
        cssRes.on('data', (chunk) => cssData += chunk);
        cssRes.on('end', () => {
          const cssHex = cssData.match(/#[0-9a-fA-F]{3,6}/g) || [];
          console.log('CSS Hex:', [...new Set(cssHex)]);
        });
      });
    }
  });
}).on('error', (err) => console.error(err));
