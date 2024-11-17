import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Reads an SVG file from the public/icons directory
 * @param filename The name of the SVG file (e.g., '3d-cube.svg')
 * @returns The SVG content as a string
 */
export async function readSvgFile(filename: string): Promise<string> {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, '../../public/icons', filename);
  return await readFile(filePath, 'utf-8');
}
