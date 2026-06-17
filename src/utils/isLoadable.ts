export const isLoadableModule = (file: string): boolean =>
  (file.endsWith(".js") || file.endsWith(".ts")) && !file.endsWith(".d.ts");
