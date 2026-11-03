const tabs = [...document.querySelectorAll('[role="tab"]')];
function activate(tab) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.dataset.panel).hidden = !selected;
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activate(tabs[next]); tabs[next].focus(); }
  });
});
const search = document.getElementById('tool-search');
const rows = [...document.querySelectorAll('.tool-row')];
search.addEventListener('input', () => {
  const query = search.value.trim().toLocaleLowerCase();
  for (const row of rows) row.hidden = !row.dataset.name.toLocaleLowerCase().includes(query);
  document.getElementById('no-results').hidden = rows.some(row => !row.hidden);
});
rows.forEach(row => row.addEventListener('click', () => {
  document.getElementById('demo-status').textContent = `${row.querySelector('b').textContent} 已选中 · 这是体验演示，不会运行本机程序。`;
}));
document.getElementById('preview-plan').addEventListener('click', () => {
  const plan = document.getElementById('plan-select').value;
  const target = document.getElementById('demo-target').value.trim();
  document.getElementById('plan-result').textContent = target ? `${plan} → ${target}。方案准备好了；在 SuperBay 中即可交给工具运行。` : '先填写一个目标，再预览本次方案。';
});
document.getElementById('copy-install').addEventListener('click', async () => {
  const text = document.getElementById('install-code').textContent;
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = '已复制，可以在 PowerShell 中继续。';
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('install-code'));
    const selection = window.getSelection();
    selection.removeAllRanges(); selection.addRange(range);
    status.textContent = '命令已选中，请按 Ctrl+C 复制。';
  }
});
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// An explanatory configuration preview. No commands or local files are executed.
const commandInput = document.getElementById('command-input');
const commandArgs = document.getElementById('command-args');
const commandTarget = document.getElementById('command-target');
const commandOutput = document.getElementById('command-output');
const commandShell = document.getElementById('command-shell');
const commandTerminal = document.getElementById('command-terminal');
const commandRuntime = document.getElementById('command-runtime');
const commandAdmin = document.getElementById('command-admin');
let commandMode = 'default';
const drafts = {default:'python -u "main.py"', plan:'python -u "main.py" --target {目标} --output "{输出目录:dir}"'};
function refreshCommand() {
  let result = commandInput.value.trim();
  const missing = commandMode === 'plan' && (!commandTarget.value.trim() || !commandOutput.value.trim());
  if (commandMode === 'plan') {
    const values = {'目标':commandTarget.value.trim(), '输出目录:dir':commandOutput.value.trim()};
    result = result.replace(/\{(目标|输出目录:dir)\}/g, (match, name) => values[name] || match);
  } else if (result && commandArgs.value.trim()) result += ' ' + commandArgs.value.trim();
  document.getElementById('command-result').textContent = result || '自动识别可运行入口 → 未找到时打开工具目录';
  document.getElementById('command-preview-title').textContent = missing ? '填好参数，再出发。' : result ? '准备好，就出发。' : '让应用帮你找入口。';
  document.getElementById('command-language').textContent = commandShell.value === 'cmd' ? 'CMD' : 'POWERSHELL';
  document.getElementById('runtime-summary').textContent = commandRuntime.value;
  document.getElementById('terminal-summary').textContent = commandAdmin.checked ? '系统提权流程' : commandTerminal.value;
  document.getElementById('admin-summary').textContent = commandAdmin.checked ? '管理员权限 · 启动时触发 UAC' : '普通权限';
  document.getElementById('preview-explanation').textContent = commandAdmin.checked ? '管理员命令启动走系统提权流程，当前不会交给所选外部终端。' : commandTerminal.value !== '默认控制台' ? '命令会交给你选择的外部终端。该模式下，应用内不收集这次运行的输出日志。' : commandMode === 'plan' ? '这里的目标与目录是示例填写值；应用内还可选择或拖入文件、目录，并记住每个方案的上次输入。' : '自定义命令优先生效。命令留空时，应用会尝试识别入口；找不到时打开工具目录。';
}
document.querySelectorAll('[data-command-mode]').forEach(button => button.addEventListener('click', () => {
  drafts[commandMode] = commandInput.value;
  commandMode = button.dataset.commandMode;
  commandInput.value = drafts[commandMode];
  document.querySelectorAll('[data-command-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.getElementById('scheme-fields').hidden = commandMode !== 'plan';
  document.getElementById('default-fields').hidden = commandMode === 'plan';
  document.getElementById('mode-description').textContent = commandMode === 'plan' ? '把变化项留成占位符。每次运行时填写目标和目录，再检查最终命令。' : '设置工具的默认启动方式。临时参数可以在启动时追加。';
  refreshCommand();
}));
[commandInput, commandArgs, commandTarget, commandOutput, commandShell, commandTerminal, commandRuntime, commandAdmin].forEach(element => element.addEventListener('input', refreshCommand));
document.getElementById('reset-command').addEventListener('click', () => {
  drafts.default = 'python -u "main.py"'; drafts.plan = 'python -u "main.py" --target {目标} --output "{输出目录:dir}"';
  commandInput.value = drafts[commandMode]; commandArgs.value = '--help';
  commandTarget.value = 'example.test'; commandOutput.value = 'D:\\Results';
  commandShell.value = 'cmd'; commandTerminal.selectedIndex = 0; commandRuntime.selectedIndex = 0; commandAdmin.checked = false;
  refreshCommand();
});
refreshCommand();
