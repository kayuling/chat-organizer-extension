# Chat Organizer for ChatGPT & Claude

> A Chrome extension that brings bulk chat management to ChatGPT and Claude — select, move, and delete multiple chats in seconds.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?logo=googlechrome)
![Version](https://img.shields.io/badge/version-1.1-brightgreen)
![Platform](https://img.shields.io/badge/platform-chatgpt.com%20%7C%20claude.ai-412991)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

If you've ever had dozens (or hundreds) of chats cluttering your sidebar, you know how painful it is to manage them one by one. **Chat Organizer** fixes that. It injects a sleek management panel directly into the ChatGPT or Claude sidebar, letting you select chats in bulk and move or delete them with a single click.

| ChatGPT sidebar | Extension popup | Panel in action |
|---|---|---|
| ![ChatGPT sidebar](screenshots/01-sidebar.png) | ![Extension popup](screenshots/02-popup.png) | ![Panel in action](screenshots/03-panel-in-action.png) |

---

## Features

- **Works on both ChatGPT and Claude** — the same panel and workflow on `chatgpt.com` and `claude.ai`
- **Checkbox selection** — every chat in the sidebar gets a checkbox for easy picking
- **Shift-click range selection** — select a whole block of chats with two clicks
- **Select All / Deselect All** — one click to grab everything
- **Bulk Move to Project** — choose a target project from a dropdown and move all selected chats at once
- **Bulk Delete** — delete multiple chats with automatic confirmation handling
- **Queue persistence** — operations survive page re-renders and auto-resume where they left off
- **Auto-reload** — the page refreshes cleanly after a queue finishes
- **Popup panel toggle** — show or hide the panel from the extension icon without leaving the page

---

## Requirements

- Google Chrome or any Chromium-based browser with **Manifest V3** support
- An active session on [https://chatgpt.com](https://chatgpt.com) or [https://claude.ai](https://claude.ai)

---

## Installation

Since this extension isn't on the Chrome Web Store (yet), load it manually in a couple of steps:

1. Clone or download this repository to your machine.
2. Open **`chrome://extensions`** in Chrome.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked**.
5. Select the `chatgpt-chats-management-tool` folder.
6. The extension icon appears in your toolbar — pin it for quick access.

---

## How to Use

### Moving chats to a project

1. Go to [https://chatgpt.com](https://chatgpt.com) or [https://claude.ai](https://claude.ai).
2. Click the extension icon and turn the **Panel** toggle **on**.
3. Checkboxes appear next to every chat in the sidebar — start selecting.
4. Use **Shift + click** to select a range of chats quickly.
5. Pick a target project from the **Project** dropdown in the panel.
6. Click **Move Selected to Project** and watch the status bar for progress.

### Deleting chats

1. Select the chats you want to remove (same checkbox flow as above).
2. Click **Delete** in the panel.
3. The extension handles each confirmation dialog automatically.
4. The page reloads once all deletions are complete.

> ⚠️ Deletion is permanent. Double-check your selection before hitting Delete.

---

## File Structure

```
chatgpt-chats-management-tool/
├── manifest.json    # Extension config, permissions, and host matching
├── popup.html       # Popup UI markup and styles
├── popup.js         # Panel toggle logic and popup state management
├── content.js       # Sidebar injection, checkbox logic, and queue automation
└── icons/           # Extension icons (16, 32, 48, 128 px)
```

---

## Permissions

| Permission | Why it's needed |
|---|---|
| `activeTab` | Interact with the currently open tab from the popup |
| `scripting` | Inject and execute the panel toggle in the active tab |
| `host_permissions` → `chatgpt.com/*` | Enable the extension on ChatGPT pages |
| `host_permissions` → `claude.ai/*` | Enable the extension on Claude pages |

---

## Known Limitations

- **DOM dependency** — the extension targets the sidebar structure of each site. If ChatGPT or Claude updates their UI, some selectors may break. Check back here for updates.
- **Dynamic re-renders** — queue logic is best-effort under heavy sidebar activity. If it stalls, refresh and retry.
- **Not affiliated with OpenAI or Anthropic** — this is an independent tool, not an official product of either company.

---

## Troubleshooting

**Panel doesn't appear**
Make sure you're on `https://chatgpt.com` or `https://claude.ai`, then open the popup and confirm the toggle is on.

**Projects dropdown is empty**
Wait a moment for the sidebar to fully load, then click **Refresh Projects** in the panel. On Claude, the extension will automatically open and close the project picker to populate the list.

**Action stops mid-queue**
Refresh the page, re-select your chats, and run the action again.

**Delete confirmation doesn't fire**
Wait for the UI to settle after selecting chats, then retry. Rapid selections can sometimes outpace the modal.

---

## Development

1. Edit `manifest.json`, `popup.html`, `popup.js`, or `content.js` directly.
2. Go to `chrome://extensions` and click the **reload** button on the extension card after each change.
3. Open Chrome DevTools on `chatgpt.com` or `claude.ai` to inspect DOM selectors and debug runtime behavior.

---

## Screenshots

| ChatGPT sidebar | Extension popup | Panel in action |
|---|---|---|
| ![ChatGPT sidebar](screenshots/01-sidebar.png) | ![Extension popup](screenshots/02-popup.png) | ![Panel in action](screenshots/03-panel-in-action.png) |

---

## Disclaimer

Use at your own risk. This project is provided as-is, without warranty of any kind. Exercise caution with irreversible operations like chat deletion — there is no undo.
