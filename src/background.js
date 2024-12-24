chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'proxyFetch') {
    console.log('proxyFetch message>>>:', message);
    // 通过 fetch 请求代理访问
    fetch(message.url, {
      method: message.method || 'GET',
      headers: message.headers || {},
      body: message.body || null
    })
      .then(response => {
        // const contentType = response.headers.get('Content-Type');
        // const data = contentType.includes('application/json')
        //   ? response.json()
        //   : contentType.includes('image')? response.arrayBuffer(): response.text();
        sendResponse({
          ok: response.ok,
          status: response.status,
          headers: [...response.headers],
          data: response,
        });
      })
      .catch(error => {
        console.error('Proxy fetch error:', error);
        sendResponse({ ok: false, error: error.message });
      });
    return true; // 告诉 Chrome 扩展，此响应是异步的
  }
});
