# ChatGPT Conversation Copier

A Chrome extension that allows you to easily copy the current ChatGPT conversation to your clipboard.

## Features

- Copy the entire ChatGPT conversation with a single click – now preserves full Markdown (headings, tables, code-blocks, etc.) exactly as rendered by ChatGPT
- Use the keyboard shortcut (Ctrl+Shift+C) to quickly copy the conversation
- Right-click context menu option for easy access
- Visual feedback when copying is complete

## Installation

### From Source Code

1. Download or clone this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension should now be installed and visible in your Chrome toolbar

### From Chrome Web Store (Coming Soon)

1. Visit the Chrome Web Store page for this extension (link will be added when published)
2. Click "Add to Chrome"
3. Confirm the installation when prompted

## Usage

There are three ways to copy a ChatGPT conversation:

1. **Extension Button**: Click the extension icon in your Chrome toolbar and then click the "Copy Conversation" button in the popup.

2. **Keyboard Shortcut**: While on the ChatGPT page, press `Ctrl+Shift+C` to copy the conversation directly.

3. **Context Menu**: Right-click anywhere on the ChatGPT page and select "Copy ChatGPT Conversation" from the context menu.

After copying, you'll see a notification confirming that the conversation has been copied to your clipboard. You can then paste it into any document or text editor.

### Output format

Every turn is wrapped in lightweight tags so that multi-turn chats remain easy to parse later:

```text
<User>
My prompt here.
</User>

<Assistant>
```md
### A heading
Some *Markdown* content, code blocks, lists… – exactly as ChatGPT shows it in the UI.
```
</Assistant>
```

For assistant replies the extension first converts the underlying HTML back into Markdown using [Turndown](https://github.com/mixmark-io/turndown) with the GFM plugin, so code fences, tables and strikethrough are preserved.

## Troubleshooting

If the extension doesn't correctly copy the conversation:

1. Make sure you're on a supported URL (`https://chat.openai.com/*` or `https://chatgpt.com/*`).
2. Try refreshing the page and copying again (DOM may not be fully loaded).
3. If the assistant Markdown looks flattened (no headings/tables), the Turndown library may have failed to load – open DevTools > Console and look for warnings.
4. The ChatGPT DOM structure might have changed; please open an issue with a sample page.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
