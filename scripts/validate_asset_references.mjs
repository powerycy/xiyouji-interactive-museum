import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const markdownRoots = [
  path.join(root, 'HANDOFF.md'),
  path.join(root, 'docs'),
  path.join(root, 'public/assets')
];
const jsonRoots = [
  path.join(root, 'content')
];

const assetRefPattern = /(^|[\s`"'([{])((?:\/assets\/|public\/assets\/)[^\s`'")\]}，、。；：]+)/g;
const trailingPunctuationPattern = /[.,;:!?]+$/;

function walkMarkdown(entryPath) {
  if (!fs.existsSync(entryPath)) return [];

  const stat = fs.statSync(entryPath);
  if (stat.isFile()) {
    return entryPath.endsWith('.md') ? [entryPath] : [];
  }

  return fs.readdirSync(entryPath, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(entryPath, entry.name);
    return entry.isDirectory() ? walkMarkdown(fullPath) : walkMarkdown(fullPath);
  });
}

function walkJson(entryPath) {
  if (!fs.existsSync(entryPath)) return [];

  const stat = fs.statSync(entryPath);
  if (stat.isFile()) {
    return entryPath.endsWith('.json') ? [entryPath] : [];
  }

  return fs.readdirSync(entryPath, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(entryPath, entry.name);
    return entry.isDirectory() ? walkJson(fullPath) : walkJson(fullPath);
  });
}

function walkFiles(entryPath) {
  if (!fs.existsSync(entryPath)) return [];

  const stat = fs.statSync(entryPath);
  if (stat.isFile()) return [entryPath];

  return fs.readdirSync(entryPath, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(entryPath, entry.name);
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath];
  });
}

function toPublicRelative(ref) {
  if (ref.startsWith('/assets/')) return `public${ref}`;
  return ref;
}

function toAbsolute(ref) {
  return path.join(root, toPublicRelative(ref));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wildcardExists(ref, publicAssetFiles) {
  const publicRelative = toPublicRelative(ref).split(path.sep).join('/');
  const pattern = new RegExp(`^${escapeRegex(publicRelative).replace(/\\\*/g, '[^/]*')}$`);
  return publicAssetFiles.some((file) => pattern.test(file));
}

function lineNumber(text, index) {
  return text.slice(0, index).split('\n').length;
}

const markdownFiles = [...new Set(markdownRoots.flatMap(walkMarkdown))].sort();
const jsonFiles = [...new Set(jsonRoots.flatMap(walkJson))].sort();
const publicAssetFiles = walkFiles(path.join(root, 'public/assets'))
  .map((file) => path.relative(root, file).split(path.sep).join('/'));

let checkedMarkdownCount = 0;
let checkedJsonCount = 0;
const missing = [];

for (const file of markdownFiles) {
  const text = fs.readFileSync(file, 'utf8');

  for (const match of text.matchAll(assetRefPattern)) {
    const ref = match[2].replace(trailingPunctuationPattern, '');
    checkedMarkdownCount += 1;

    const exists = ref.includes('*')
      ? wildcardExists(ref, publicAssetFiles)
      : fs.existsSync(toAbsolute(ref));

    if (!exists) {
      missing.push({
        file: path.relative(root, file),
        line: lineNumber(text, match.index + match[1].length),
        ref
      });
    }
  }
}

function collectAssetRefsFromJson(value, refs = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectAssetRefsFromJson(item, refs);
    return refs;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectAssetRefsFromJson(item, refs);
    return refs;
  }

  if (typeof value === 'string' && value.startsWith('/assets/')) {
    refs.push(value);
  }

  return refs;
}

for (const file of jsonFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(text);

  for (const ref of collectAssetRefsFromJson(data)) {
    checkedJsonCount += 1;

    const exists = ref.includes('*')
      ? wildcardExists(ref, publicAssetFiles)
      : fs.existsSync(toAbsolute(ref));

    if (!exists) {
      missing.push({
        file: path.relative(root, file),
        line: lineNumber(text, text.indexOf(ref)),
        ref
      });
    }
  }
}

if (missing.length > 0) {
  for (const item of missing) {
    console.error(`${item.file}:${item.line} missing asset reference: ${item.ref}`);
  }
  process.exit(1);
}

console.log(`asset references ok (${checkedMarkdownCount} markdown refs in ${markdownFiles.length} files, ${checkedJsonCount} json refs in ${jsonFiles.length} files)`);
