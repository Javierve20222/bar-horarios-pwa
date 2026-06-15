const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    // Cache largo para assets con hash
    if (filePath.includes('/_expo/static/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// SPA fallback - para rutas que no tienen archivo HTML propio
app.get('*', (req, res) => {
  // Si el archivo existe como .html, Express.static ya lo habrá servido
  // Si no, servir index.html para que Expo Router maneje la ruta
  const htmlPath = path.join(__dirname, 'public', req.path + '.html');
  const fs = require('fs');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bar Horarios PWA running on port ${PORT}`);
});
