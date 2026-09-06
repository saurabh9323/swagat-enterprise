import { query } from '../db/pool.js';

export const defaultTheme = {
  mode: 'dark',
  sidebarColor: '#071512',
  navbarColor: '#10281f',
  pageColor: '#111c29',
  panelColor: '#25323b',
  accentColor: '#d8ff69',
  textColor: '#eef4f0',
};

export async function getTheme() {
  const result = await query('select * from get_site_setting($1)', ['theme']);
  return result.rows[0]?.setting_value || defaultTheme;
}

export async function saveTheme(theme, userId) {
  const result = await query(
    'select * from upsert_site_setting($1, $2::jsonb, $3, $4)',
    ['theme', JSON.stringify(theme), 'Website and admin theme colors.', userId]
  );
  return result.rows[0].setting_value;
}
