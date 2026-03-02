
const toggleBtn = document.getElementById('toggleBtn');
const statusEl = document.getElementById('status');

function setStatus(text, type = '') {
  statusEl.textContent = text;
  statusEl.className = type;
}

toggleBtn.addEventListener('click', async () => {
  toggleBtn.disabled = true;
  setStatus('Checking current tab...');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || !tab.url.includes('chatgpt.com')) {
      setStatus('Open chatgpt.com and try again.', 'error');
      return;
    }
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const panel = document.getElementById('bcm3-panel');
        if (panel) {
          panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        } else {
          window._bcmInit && window._bcmInit();
        }
      }
    });
    setStatus('Panel ready.', 'ok');
    window.close();
  } catch (err) {
    setStatus('Could not open the panel. Retry.', 'error');
  } finally {
    toggleBtn.disabled = false;
  }
});
