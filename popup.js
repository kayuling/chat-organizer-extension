
const toggleBtn = document.getElementById('toggleBtn');
const statusEl = document.getElementById('status');
const toggleLabel = document.getElementById('toggleLabel');

function setStatus(text, type = '') {
  statusEl.textContent = text;
  statusEl.className = type;
}

function setToggleUI(isOn) {
  toggleBtn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
  toggleLabel.textContent = isOn ? 'On' : 'Off';
}

async function getActiveChatGPTTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || !tab.url.includes('chatgpt.com')) return null;
  return tab;
}

async function readCurrentPanelState(tabId) {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const panel = document.getElementById('bcm3-panel');
      if (!panel) return false;
      const style = window.getComputedStyle(panel);
      return panel.style.display !== 'none' && style.display !== 'none' && style.visibility !== 'hidden';
    }
  });
  return Boolean(result && result.result);
}

async function initToggleState() {
  try {
    const tab = await getActiveChatGPTTab();
    if (!tab) {
      setToggleUI(false);
      setStatus('Open chatgpt.com to use the toggle.', 'error');
      return;
    }
    const isOn = await readCurrentPanelState(tab.id);
    setToggleUI(isOn);
    setStatus(isOn ? 'Panel is currently on.' : 'Panel is currently off.');
  } catch (err) {
    setStatus('Could not read panel state.', 'error');
  }
}

toggleBtn.addEventListener('click', async () => {
  toggleBtn.disabled = true;
  setStatus('Checking current tab...');
  try {
    const tab = await getActiveChatGPTTab();
    if (!tab) {
      setStatus('Open chatgpt.com and try again.', 'error');
      return;
    }
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const panel = document.getElementById('bcm3-panel');
        if (panel) {
          panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          return panel.style.display !== 'none';
        } else {
          window._bcmInit && window._bcmInit();
          return true;
        }
      }
    });
    const isOn = Boolean(result && result.result);
    setToggleUI(isOn);
    setStatus(isOn ? 'Panel turned on.' : 'Panel turned off.', 'ok');
  } catch (err) {
    setStatus('Could not toggle panel. Retry.', 'error');
  } finally {
    toggleBtn.disabled = false;
  }
});

initToggleState();
