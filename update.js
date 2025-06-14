const fs = require('fs');
const readline = require('readline');
const path = require('path');

// 创建交互式命令行界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 获取当前脚本所在目录
const scriptDir = __dirname;

// 主函数
async function updateLinks() {
  console.log("================ OneDrive 直链更新工具 ================");
  
  // 读取已有链接 (如果存在)
  let currentLinks = [];
  try {
    const htmlContent = fs.readFileSync(path.join(scriptDir, 'index.html'), 'utf8');
    const match = htmlContent.match(/const imageLinks = ($$[^$$]+\])/);
    if (match) {
      currentLinks = JSON.parse(match[1].replace(/,\s*$/, ''));
      console.log(`检测到现有链接: ${currentLinks.length}个`);
    }
  } catch (e) {
    console.log("未找到现有链接列表");
  }
  
  // 询问操作选项
  const action = await askQuestion(
    "请选择操作:\n" +
    "1. 添加新链接\n" +
    "2. 清空并重建列表\n" +
    "3. 查看当前列表\n" +
    "4. 退出\n" +
    "选择 (1-4): "
  );
  
  let newLinks = [...currentLinks];
  
  switch(action) {
    case '1': // 添加新链接
      const linksInput = await askQuestion(
        "请输入要添加的链接 (多个链接请用逗号分隔): "
      );
      
      const newItems = linksInput
        .split(',')
        .map(link => link.trim())
        .filter(link => link.length > 0);
      
      newLinks = [...newLinks, ...newItems];
      break;
      
    case '2': // 清空重建
      const confirm = await askQuestion("确定要清空所有链接? (y/n): ");
      if (confirm.toLowerCase() === 'y') {
        const newInput = await askQuestion(
          "请输入新的链接列表 (多个链接请用逗号分隔): "
        );
        newLinks = newInput
          .split(',')
          .map(link => link.trim())
          .filter(link => link.length > 0);
      }
      break;
      
    case '3': // 查看列表
      console.log("\n当前链接列表:");
      newLinks.forEach((link, index) => {
        console.log(`${index + 1}. ${link}`);
      });
      console.log();
      return;
      
    case '4': // 退出
      rl.close();
      return;
      
    default:
      console.log("无效选择");
      rl.close();
      return;
  }
  
  // 确保没有重复链接
  newLinks = [...new Set(newLinks)];
  
  // 更新 HTML 文件
  updateHtmlFile(newLinks);
  
  // 保存链接为文本文件
  saveLinkFile(newLinks);
  
  console.log(`成功更新! 现在共有 ${newLinks.length} 个链接`);
  rl.close();
}

// 更新 HTML 文件
function updateHtmlFile(links) {
  const template = `<!DOCTYPE html>
<html>
<head>
  <script>
    // OneDrive 图片直链列表 (最后更新: ${new Date().toLocaleString()})
    const imageLinks = ${JSON.stringify(links, null, 2)};
    
    // 添加随机参数防止缓存
    const randomParam = \`?t=\${Date.now()}\`;
    
    // 随机重定向到图片
    function redirectToRandomImage() {
      try {
        const randomIndex = Math.floor(Math.random() * imageLinks.length);
        const imgLink = imageLinks[randomIndex] + randomParam;
        console.log("Redirecting to:", imgLink);
        window.location.replace(imgLink);
      } catch (error) {
        console.error("Redirect error:", error);
        showFallback();
      }
    }
    
    // 错误回退显示
    function showFallback() {
      const infoDiv = document.createElement("div");
      infoDiv.innerHTML = \`
        <h3>随机图片服务</h3>
        <p>总图片数: \${imageLinks.length}</p>
        <p>如果重定向失败，请检查：</p>
        <ul>
          <li>OneDrive 分享设置是否为"任何人可查看"</li>
          <li>浏览器是否启用 JavaScript</li>
          <li>添加随机参数防止缓存 \${randomParam}</li>
        </ul>
        <p>最近更新: \${new Date().toLocaleString()}</p>
      \`;
      document.body.appendChild(infoDiv);
    }
    
    // 页面加载后立即重定向
    window.addEventListener('DOMContentLoaded', redirectToRandomImage);
  </script>
</head>
<body>
  <p style="text-align:center;margin-top:20%">
    正在重定向到随机图片...
    <br>
    <small>如果没有自动跳转，<a href="javascript:redirectToRandomImage()">请点击这里</a></small>
  </p>
</body>
</html>`;

  fs.writeFileSync(path.join(scriptDir, 'index.html'), template);
}

// 保存链接为文本文件
function saveLinkFile(links) {
  const textContent = `# OneDrive 图片直链库 (最后更新: ${new Date().toLocaleString()})\n` +
                      links.map(link => link).join('\n');
  
  fs.writeFileSync(path.join(scriptDir, 'image-links.txt'), textContent);
}

// 命令行交互辅助函数
function askQuestion(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

// 启动工具
updateLinks();
