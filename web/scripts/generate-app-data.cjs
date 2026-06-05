#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const appsDir = process.env.APPS_DIR
  ? path.resolve(process.env.APPS_DIR)
  : path.resolve(__dirname, '../../apps');

const outputFile = path.resolve(__dirname, '../src/data/apps.json');

if (!fs.existsSync(appsDir)) {
  console.warn(`[generate-app-data] Apps directory not found: ${appsDir}`);
  console.warn('[generate-app-data] Writing empty apps.json');
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, '[]\n');
  process.exit(0);
}

const files = fs
  .readdirSync(appsDir)
  .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
  .sort();

const apps = [];
for (const file of files) {
  const filePath = path.join(appsDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(raw);
    if (data && typeof data === 'object') {
      apps.push(data);
    } else {
      console.warn(`[generate-app-data] Skipping ${file}: not a valid YAML object`);
    }
  } catch (err) {
    console.error(`[generate-app-data] Failed to parse ${file}: ${err.message}`);
  }
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(apps, null, 2) + '\n');
console.log(`[generate-app-data] ${apps.length} apps → ${outputFile}`);
