function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function inferTsType(value: unknown, name: string, interfaces: string[]): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    return inferTsType(value[0], name, interfaces) + '[]';
  }
  switch (typeof value) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    default:
      if (typeof value === 'object') {
        const iName = capitalize(name);
        interfaces.push(generateInterfaceBlock(value as Record<string, unknown>, iName, interfaces));
        return iName;
      }
      return 'unknown';
  }
}

function generateInterfaceBlock(obj: Record<string, unknown>, name: string, interfaces: string[]): string {
  const fields = Object.entries(obj).map(([key, val]) => {
    const type = inferTsType(val, key, interfaces);
    return `  ${key}: ${type};`;
  });
  return `interface ${name} {\n${fields.join('\n')}\n}`;
}

export function jsonToTypeScript(json: unknown): string {
  if (typeof json !== 'object' || json === null) return `type Root = ${typeof json};`;
  const interfaces: string[] = [];
  if (Array.isArray(json)) {
    const itemType = json.length > 0 ? inferTsType(json[0], 'RootItem', interfaces) : 'unknown';
    interfaces.push(`type Root = ${itemType}[];`);
  } else {
    interfaces.push(generateInterfaceBlock(json as Record<string, unknown>, 'Root', interfaces));
  }
  return interfaces.reverse().join('\n\n');
}

function inferZodType(value: unknown, indent: string): string {
  if (value === null) return 'z.null()';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'z.array(z.unknown())';
    return `z.array(${inferZodType(value[0], indent)})`;
  }
  switch (typeof value) {
    case 'string': return 'z.string()';
    case 'number': return Number.isInteger(value) ? 'z.number().int()' : 'z.number()';
    case 'boolean': return 'z.boolean()';
    default:
      if (typeof value === 'object') {
        return generateZodObject(value as Record<string, unknown>, indent);
      }
      return 'z.unknown()';
  }
}

function generateZodObject(obj: Record<string, unknown>, indent: string): string {
  const inner = indent + '  ';
  const fields = Object.entries(obj).map(([key, val]) => `${inner}${key}: ${inferZodType(val, inner)},`);
  return `z.object({\n${fields.join('\n')}\n${indent}})`;
}

export function jsonToZod(json: unknown): string {
  if (typeof json !== 'object' || json === null) return `const schema = ${inferZodType(json, '')};\n`;
  if (Array.isArray(json)) {
    const item = json.length > 0 ? inferZodType(json[0], '') : 'z.unknown()';
    return `const schema = z.array(${item});\n`;
  }
  return `const schema = ${generateZodObject(json as Record<string, unknown>, '')};\n`;
}

function goType(value: unknown, name: string, structs: string[]): string {
  if (value === null) return 'interface{}';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]interface{}';
    return '[]' + goType(value[0], name, structs);
  }
  switch (typeof value) {
    case 'string': return 'string';
    case 'number': return Number.isInteger(value) ? 'int' : 'float64';
    case 'boolean': return 'bool';
    default:
      if (typeof value === 'object') {
        const sName = capitalize(name);
        structs.push(generateGoStruct(value as Record<string, unknown>, sName, structs));
        return sName;
      }
      return 'interface{}';
  }
}

function generateGoStruct(obj: Record<string, unknown>, name: string, structs: string[]): string {
  const fields = Object.entries(obj).map(([key, val]) => {
    const t = goType(val, key, structs);
    return `\t${capitalize(key)} ${t} \`json:"${key}"\``;
  });
  return `type ${name} struct {\n${fields.join('\n')}\n}`;
}

export function jsonToGoStruct(json: unknown): string {
  if (typeof json !== 'object' || json === null) return '// Cannot generate struct from primitive';
  const structs: string[] = [];
  if (Array.isArray(json)) {
    if (json.length > 0 && typeof json[0] === 'object' && json[0] !== null) {
      structs.push(generateGoStruct(json[0] as Record<string, unknown>, 'Root', structs));
    } else { return '// Array of primitives'; }
  } else {
    structs.push(generateGoStruct(json as Record<string, unknown>, 'Root', structs));
  }
  return structs.reverse().join('\n\n');
}

function pyType(value: unknown): string {
  if (value === null) return 'None';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'list';
    return `list[${pyType(value[0])}]`;
  }
  switch (typeof value) {
    case 'string': return 'str';
    case 'number': return Number.isInteger(value) ? 'int' : 'float';
    case 'boolean': return 'bool';
    default: return 'dict';
  }
}

export function jsonToPython(json: unknown): string {
  if (typeof json !== 'object' || json === null) return '# Cannot generate dataclass from primitive';
  const obj = Array.isArray(json) ? (json.length > 0 && typeof json[0] === 'object' ? json[0] as Record<string, unknown> : null) : json as Record<string, unknown>;
  if (!obj) return '# Array of primitives';
  const fields = Object.entries(obj).map(([key, val]) => `    ${key}: ${pyType(val)}`);
  return `from dataclasses import dataclass\n\n@dataclass\nclass Root:\n${fields.join('\n')}`;
}

function sqlType(value: unknown): string {
  if (value === null) return 'TEXT';
  if (Array.isArray(value)) return 'TEXT';
  switch (typeof value) {
    case 'string': return 'TEXT';
    case 'number': return Number.isInteger(value) ? 'INTEGER' : 'REAL';
    case 'boolean': return 'BOOLEAN';
    default: return 'TEXT';
  }
}

export function jsonToSql(json: unknown): string {
  if (typeof json !== 'object' || json === null) return '-- Cannot generate table from primitive';
  const obj = Array.isArray(json) ? (json.length > 0 && typeof json[0] === 'object' ? json[0] as Record<string, unknown> : null) : json as Record<string, unknown>;
  if (!obj) return '-- Array of primitives';
  const cols = Object.entries(obj).map(([key, val]) => `  ${key} ${sqlType(val)}`);
  return `CREATE TABLE root (\n${cols.join(',\n')}\n);`;
}

export function jsonToYaml(json: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  if (json === null) return 'null';
  if (typeof json === 'string') return json.includes('\n') ? `|\n${pad}  ${json.replace(/\n/g, `\n${pad}  `)}` : json;
  if (typeof json === 'number' || typeof json === 'boolean') return String(json);
  if (Array.isArray(json)) {
    if (json.length === 0) return '[]';
    return json.map(item => {
      const val = typeof item === 'object' && item !== null
        ? '\n' + Object.entries(item as Record<string, unknown>).map(([k, v]) => `${pad}    ${k}: ${jsonToYaml(v, indent + 2)}`).join('\n')
        : ' ' + jsonToYaml(item, indent + 1);
      return `${pad}  -${val}`;
    }).join('\n');
  }
  if (typeof json === 'object') {
    const entries = Object.entries(json as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries.map(([key, val]) => {
      if (typeof val === 'object' && val !== null) {
        return `${pad}${key}:\n${jsonToYaml(val, indent + 1)}`;
      }
      return `${pad}${key}: ${jsonToYaml(val, indent + 1)}`;
    }).join('\n');
  }
  return String(json);
}
