import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'packages', 'protocol', 'dist', 'index.js');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix 1: Change import to use default export and the full protobufjs package
  content = content.replace(
    /import \* as \$protobuf from "protobufjs\/minimal"/g,
    'import $protobuf from "protobufjs"'
  );

  // Fix 2: Bypass read-only roots property
  content = content.replace(
    /const \$root = \$protobuf\.roots\["default"\] \|\| \(\$protobuf\.roots\["default"\] = {}\);/g,
    'const $root = ($protobuf.roots && $protobuf.roots["default"]) || {};'
  );

  fs.writeFileSync(filePath, content);
  console.log('Successfully applied ESM fixes to protocol dist/index.js');
} else {
  console.error('Protocol dist file not found at:', filePath);
  process.exit(1);
}
