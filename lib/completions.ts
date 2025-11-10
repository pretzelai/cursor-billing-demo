export function generateCompletion(code: string, cursorPosition: any): string {
  return `const products = await getProductsByCategory('electronics')
  console.log('Found products:', products.length)`;
}
