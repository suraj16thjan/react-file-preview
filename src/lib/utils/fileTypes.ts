export type FileCategory =
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'text'
  | 'code'
  | 'markdown'
  | 'csv'
  | 'spreadsheet'
  | 'document'
  | 'html'
  | 'svg'
  | 'json'
  | 'xml'
  | 'archive'
  | 'font'
  | 'model3d'
  | 'email'
  | 'unknown';

const extensionMap: Record<string, FileCategory> = {
  // Images
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image',
  bmp: 'image', ico: 'image', tiff: 'image', tif: 'image', avif: 'image',
  apng: 'image', jfif: 'image',

  // SVG (separate for inline rendering)
  svg: 'svg',

  // Video
  mp4: 'video', webm: 'video', ogg: 'video', mov: 'video', avi: 'video',
  mkv: 'video', m4v: 'video', flv: 'video', wmv: 'video', '3gp': 'video',

  // Audio
  mp3: 'audio', wav: 'audio', oga: 'audio', flac: 'audio', aac: 'audio',
  wma: 'audio', m4a: 'audio', opus: 'audio', mid: 'audio', midi: 'audio',

  // PDF
  pdf: 'pdf',

  // Markdown
  md: 'markdown', mdx: 'markdown', markdown: 'markdown',

  // CSV / TSV
  csv: 'csv', tsv: 'csv',

  // Spreadsheet
  xlsx: 'spreadsheet', xls: 'spreadsheet', ods: 'spreadsheet',

  // Document (Word)
  docx: 'document', doc: 'document', odt: 'document', rtf: 'document',

  // HTML
  html: 'html', htm: 'html',

  // JSON
  json: 'json', jsonl: 'json', geojson: 'json',

  // XML
  xml: 'xml', xsl: 'xml', xslt: 'xml', rss: 'xml', atom: 'xml', plist: 'xml',

  // Archives
  zip: 'archive', tar: 'archive', gz: 'archive', '7z': 'archive',
  rar: 'archive', bz2: 'archive', xz: 'archive', tgz: 'archive',

  // Fonts
  ttf: 'font', otf: 'font', woff: 'font', woff2: 'font', eot: 'font',

  // 3D Models
  stl: 'model3d', obj: 'model3d', gltf: 'model3d', glb: 'model3d',
  fbx: 'model3d', '3ds': 'model3d',

  // Email
  eml: 'email', msg: 'email',

  // Code
  js: 'code', jsx: 'code', ts: 'code', tsx: 'code', mjs: 'code', cjs: 'code',
  py: 'code', rb: 'code', rs: 'code', go: 'code', java: 'code', kt: 'code',
  scala: 'code', c: 'code', cpp: 'code', cc: 'code', h: 'code', hpp: 'code',
  cs: 'code', swift: 'code', m: 'code', mm: 'code',
  php: 'code', pl: 'code', pm: 'code', r: 'code', R: 'code',
  lua: 'code', vim: 'code', el: 'code', clj: 'code', cljs: 'code',
  erl: 'code', ex: 'code', exs: 'code', hs: 'code',
  dart: 'code', v: 'code', vhdl: 'code', verilog: 'code',
  sql: 'code', graphql: 'code', gql: 'code', proto: 'code',
  sh: 'code', bash: 'code', zsh: 'code', fish: 'code', ps1: 'code', bat: 'code', cmd: 'code',
  yml: 'code', yaml: 'code', toml: 'code', ini: 'code', cfg: 'code', conf: 'code',
  dockerfile: 'code', makefile: 'code', cmake: 'code',
  css: 'code', scss: 'code', sass: 'code', less: 'code', styl: 'code',
  vue: 'code', svelte: 'code', astro: 'code',
  tf: 'code', hcl: 'code', nix: 'code', dhall: 'code',
  zig: 'code', nim: 'code', cr: 'code', d: 'code', pas: 'code',
  asm: 'code', s: 'code', wasm: 'code', wat: 'code',
  gradle: 'code', sbt: 'code', cabal: 'code',
  lock: 'code',

  // Plain text
  txt: 'text', log: 'text', text: 'text', readme: 'text',
  license: 'text', changelog: 'text', authors: 'text',
  env: 'text', gitignore: 'text', editorconfig: 'text',
};

const languageMap: Record<string, string> = {
  js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
  ts: 'typescript', tsx: 'typescript',
  py: 'python', rb: 'ruby', rs: 'rust', go: 'go',
  java: 'java', kt: 'kotlin', scala: 'scala',
  c: 'c', cpp: 'cpp', cc: 'cpp', h: 'c', hpp: 'cpp',
  cs: 'csharp', swift: 'swift', m: 'objectivec', mm: 'objectivec',
  php: 'php', pl: 'perl', pm: 'perl', r: 'r', R: 'r',
  lua: 'lua', vim: 'vim', el: 'lisp', clj: 'clojure', cljs: 'clojure',
  erl: 'erlang', ex: 'elixir', exs: 'elixir', hs: 'haskell',
  dart: 'dart', sql: 'sql', graphql: 'graphql', gql: 'graphql',
  sh: 'bash', bash: 'bash', zsh: 'bash', fish: 'bash', ps1: 'powershell',
  bat: 'dos', cmd: 'dos',
  yml: 'yaml', yaml: 'yaml', toml: 'ini', ini: 'ini', cfg: 'ini', conf: 'ini',
  css: 'css', scss: 'scss', sass: 'scss', less: 'less',
  vue: 'xml', svelte: 'xml', astro: 'xml',
  dockerfile: 'dockerfile', makefile: 'makefile',
  tf: 'hcl', hcl: 'hcl', nix: 'nix',
  proto: 'protobuf', zig: 'zig', nim: 'nim',
  asm: 'x86asm', s: 'x86asm', wat: 'wasm',
  json: 'json', jsonl: 'json', xml: 'xml',
  md: 'markdown', markdown: 'markdown',
  html: 'xml', htm: 'xml',
};

export function getExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  if (parts.length < 2) {
    const name = parts[0].toLowerCase();
    if (name === 'dockerfile' || name === 'makefile' || name === 'readme'
      || name === 'license' || name === 'changelog' || name === 'authors') {
      return name;
    }
    return '';
  }
  return parts[parts.length - 1];
}

export function getFileCategory(filename: string): FileCategory {
  const ext = getExtension(filename);
  return extensionMap[ext] || 'unknown';
}

export function getLanguage(filename: string): string {
  const ext = getExtension(filename);
  return languageMap[ext] || 'plaintext';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function getMimeType(filename: string): string {
  const ext = getExtension(filename);
  const mimeMap: Record<string, string> = {
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
    webp: 'image/webp', svg: 'image/svg+xml', bmp: 'image/bmp', ico: 'image/x-icon',
    tiff: 'image/tiff', tif: 'image/tiff', avif: 'image/avif',
    mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg', mov: 'video/quicktime',
    mp3: 'audio/mpeg', wav: 'audio/wav', flac: 'audio/flac', aac: 'audio/aac',
    m4a: 'audio/mp4', opus: 'audio/opus',
    pdf: 'application/pdf',
    json: 'application/json', xml: 'application/xml',
    html: 'text/html', css: 'text/css', js: 'text/javascript',
    zip: 'application/zip', gz: 'application/gzip', tar: 'application/x-tar',
    ttf: 'font/ttf', otf: 'font/otf', woff: 'font/woff', woff2: 'font/woff2',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
  return mimeMap[ext] || 'application/octet-stream';
}
