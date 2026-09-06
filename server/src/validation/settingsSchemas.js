import { z } from 'zod';

const color = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a hex color like #10281f');

export const themeSchema = z.object({
  body: z.object({
    mode: z.enum(['light', 'dark']),
    sidebarColor: color,
    navbarColor: color,
    pageColor: color,
    panelColor: color,
    accentColor: color,
    textColor: color,
  }),
});
