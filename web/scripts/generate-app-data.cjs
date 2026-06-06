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

const dirs = fs
  .readdirSync(appsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const apps = [];
for (const dir of dirs) {
  const filePath = path.join(appsDir, dir, 'metadata.yaml');
  if (!fs.existsSync(filePath)) {
    console.warn(`[generate-app-data] Skipping ${dir}: no metadata.yaml found`);
    continue;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(raw);
    if (data && typeof data === 'object') {
      apps.push(data);
    } else {
      console.warn(`[generate-app-data] Skipping ${dir}/metadata.yaml: not a valid YAML object`);
    }
  } catch (err) {
    console.error(`[generate-app-data] Failed to parse ${dir}/metadata.yaml: ${err.message}`);
  }
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(apps, null, 2) + '\n');
console.log(`[generate-app-data] ${apps.length} apps → ${outputFile}`);
