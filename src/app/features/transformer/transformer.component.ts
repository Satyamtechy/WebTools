import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsonToTypeScript, jsonToZod, jsonToGoStruct, jsonToPython, jsonToSql, jsonToYaml } from './utils/json-transforms';
import { cssToTailwind, cssToCssInJs, cssToScss } from './utils/css-transforms';
import { htmlToJsx, htmlToVue } from './utils/html-transforms';
import { colorTransform, isColor } from './utils/color-transforms';

type InputType = 'json' | 'css' | 'html' | 'color';
type TabId = 'typescript' | 'zod' | 'go' | 'python' | 'sql' | 'yaml' | 'tailwind' | 'cssinjs' | 'scss' | 'jsx' | 'vue' | 'colors';

interface Tab { id: TabId; label: string; }
interface TabGroup { header: string; tabs: Tab[]; }

const TAB_GROUPS: Record<InputType, TabGroup> = {
  json: { header: 'JSON Outputs', tabs: [
    { id: 'typescript', label: 'TypeScript' }, { id: 'zod', label: 'Zod' }, { id: 'go', label: 'Go Struct' },
    { id: 'python', label: 'Python' }, { id: 'sql', label: 'SQL' }, { id: 'yaml', label: 'YAML' },
  ]},
  css: { header: 'CSS Outputs', tabs: [
    { id: 'tailwind', label: 'Tailwind' }, { id: 'cssinjs', label: 'CSS-in-JS' }, { id: 'scss', label: 'SCSS' },
  ]},
  html: { header: 'HTML Outputs', tabs: [
    { id: 'jsx', label: 'JSX' }, { id: 'vue', label: 'Vue Template' },
  ]},
  color: { header: 'Color Outputs', tabs: [
    { id: 'colors', label: 'All Formats' },
  ]},
};

function detectInputType(raw: string): InputType {
  const t = raw.trim();
  if (!t) return 'json';
  if (isColor(t)) return 'color';
  if (t.startsWith('<')) return 'html';
  if (/[{][^}]*[a-z-]+\s*:/i.test(t) && !t.startsWith('{\"') && !/^\{[\s\S]*"[\w]+"/.test(t)) return 'css';
  return 'json';
}

@Component({
  selector: 'app-transformer',
  standalone: true,
  imports: [FormsModule, UpperCasePipe],
  templateUrl: './transformer.component.html',
  styleUrl: './transformer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransformerComponent {
  readonly input = signal('');
  readonly activeTab = signal<TabId>('typescript');
  readonly copiedTab = signal<TabId | null>(null);

  readonly inputType = computed<InputType>(() => detectInputType(this.input()));

  readonly tabGroup = computed<TabGroup>(() => TAB_GROUPS[this.inputType()]);

  readonly validationStatus = computed<{ valid: boolean; message: string }>(() => {
    const raw = this.input().trim();
    if (!raw) return { valid: false, message: '' };
    const type = this.inputType();
    if (type === 'json') {
      try { JSON.parse(raw); return { valid: true, message: '✓ Valid JSON' }; }
      catch { return { valid: false, message: '✗ Invalid JSON' }; }
    }
    return { valid: true, message: `✓ ${type.toUpperCase()} detected` };
  });

  readonly output = computed<string>(() => {
    const raw = this.input().trim();
    if (!raw) return '';
    const tab = this.activeTab();
    const type = this.inputType();

    if (type === 'json') {
      try {
        const data = JSON.parse(raw);
        switch (tab) {
          case 'typescript': return jsonToTypeScript(data);
          case 'zod': return jsonToZod(data);
          case 'go': return jsonToGoStruct(data);
          case 'python': return jsonToPython(data);
          case 'sql': return jsonToSql(data);
          case 'yaml': return jsonToYaml(data);
        }
      } catch { return ''; }
    }
    if (type === 'css') {
      switch (tab) {
        case 'tailwind': return cssToTailwind(raw);
        case 'cssinjs': return cssToCssInJs(raw);
        case 'scss': return cssToScss(raw);
      }
    }
    if (type === 'html') {
      switch (tab) {
        case 'jsx': return htmlToJsx(raw);
        case 'vue': return htmlToVue(raw);
      }
    }
    if (type === 'color') {
      return colorTransform(raw);
    }
    return '';
  });

  onInputChange(value: string): void {
    this.input.set(value);
    const group = TAB_GROUPS[detectInputType(value)];
    if (!group.tabs.some(t => t.id === this.activeTab())) {
      this.activeTab.set(group.tabs[0].id);
    }
  }

  setTab(id: TabId): void {
    this.activeTab.set(id);
  }

  async copy(): Promise<void> {
    const text = this.output();
    if (!text) return;
    await navigator.clipboard.writeText(text);
    const tab = this.activeTab();
    this.copiedTab.set(tab);
    setTimeout(() => this.copiedTab.set(null), 2000);
  }
}
