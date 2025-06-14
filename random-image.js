const imageLinks = [
  "https://img.picui.cn/free/2025/06/15/684da28518686.jpg",
  "hhttps://img.picui.cn/free/2025/06/15/684da285854e3.jpg",
  // 添加更多直链...
];

addEventListener('fetch', event => {
  event.respondWith(handleRequest());
});

function handleRequest() {
  const randomIndex = Math.floor(Math.random() * imageLinks.length);
  return Response.redirect(imageLinks[randomIndex], 302);
}
