const imageLinks = [
  "https://img.picui.cn/free/2025/06/15/684da28518686.jpg",
  "https://img.picui.cn/free/2025/06/15/684da285854e3.jpg",
  // 此处添加更多...
];

addEventListener('fetch', event => {
  event.respondWith(handleRequest());
});

function handleRequest() {
  const randomIndex = Math.floor(Math.random() * imageLinks.length);
  return Response.redirect(imageLinks[randomIndex], 302);
}
