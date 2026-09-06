export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

/**
 * Standard utility function to conditionally join classNames together.
 * Compatible with shadcn/ui patterns and Tailwind CSS.
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat(Infinity as 1)
    .filter(Boolean)
    .map((x) => {
      if (typeof x === 'object' && x !== null) {
        return Object.keys(x)
          .filter((k) => (x as Record<string, any>)[k])
          .join(' ');
      }
      return String(x);
    })
    .join(' ')
    .trim();
}
