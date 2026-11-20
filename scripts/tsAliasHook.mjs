import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');

function withExtension(filePath) {
  for (const candidate of [`${filePath}.ts`, `${filePath}.tsx`, path.join(filePath, 'index.ts'), filePath]) {
    if (existsSync(candidate)) return candidate;
  }
  return filePath;
}

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const target = withExtension(path.join(srcRoot, specifier.slice(2)));
    return { url: pathToFileURL(target).href, shortCircuit: true };
  }
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:')) {
    const base = path.dirname(fileURLToPath(context.parentURL));
    const target = withExtension(path.resolve(base, specifier));
    return { url: pathToFileURL(target).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
