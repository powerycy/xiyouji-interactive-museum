import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const markdownRoots = [
  path.join(root, 'HANDOFF.md'),
  path.join(root, 'docs'),
  path.join(root, 'public/assets')
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
const publicAssetFiles = walkFiles(path.join(root, 'public/assets'))
  .map((file) => path.relative(root, file).split(path.sep).join('/'));

let checkedCount = 0;
const missing = [];

for (const file of markdownFiles) {
  const text = fs.readFileSync(file, 'utf8');

  for (const match of text.matchAll(assetRefPattern)) {
    const ref = match[2].replace(trailingPunctuationPattern, '');
    checkedCount += 1;

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

if (missing.length > 0) {
  for (const item of missing) {
    console.error(`${item.file}:${item.line} missing asset reference: ${item.ref}`);
  }
  process.exit(1);
}

console.log(`markdown asset references ok (${checkedCount} refs in ${markdownFiles.length} files)`);
