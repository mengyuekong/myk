const fs = require('fs');

const newLinks = [
  "https://img.picui.cn/free/2025/06/15/684da28518686.jpg",
  "https://img.picui.cn/free/2025/06/15/684da285854e3.jpg",
  // ...
];

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <script>
    const imageLinks = ${JSON.stringify(newLinks)};
    const randomIndex = Math.floor(Math.random() * imageLinks.length);
    window.location.replace(imageLinks[randomIndex]);
  </script>
</head>
<body>
  <p>正在重定向到随机图片...</p>
</body>
</html>`;

fs.writeFileSync('index.html', htmlContent);
console.log('index.html 已更新！');
