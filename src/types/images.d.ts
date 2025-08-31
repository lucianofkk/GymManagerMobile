// Este archivo le dice a TypeScript cómo manejar importaciones de imágenes (.png, .jpg, etc.)
// Sin esto, TypeScript da error porque no sabe qué tipo tienen esas importaciones.
declare module '*.png' {
  const value: any;
  export default value;
}
