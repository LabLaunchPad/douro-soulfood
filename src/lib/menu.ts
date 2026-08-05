import type { CollectionEntry } from 'astro:content';

export type DietaryTag = 'vegan' | 'vegetarian' | 'gluten-free' | 'spicy' | 'halal' | 'dairy-free';

/** Category display config — controls order, labels, and vector icon names */
export const categoryConfig: Record<string, { label: string; order: number; icon: string }> = {
  'appetizers':   { label: 'Vorspeisen / Entradas',  order: 10, icon: 'appetizers' },
  'quesadillas':  { label: 'Quesadillas',            order: 20, icon: 'quesadillas' },
  'tacos':        { label: 'Tacos',                  order: 30, icon: 'tacos' },
  'bowls':        { label: 'Bowls',                  order: 40, icon: 'bowls' },
  'mains':        { label: 'Pratos Feitos',          order: 50, icon: 'mains' },
  'seafood':      { label: 'Pratos Do Mar',          order: 60, icon: 'seafood' },
  'sides':        { label: 'Beilagen / Sides',       order: 65, icon: 'sides' },
  'drinks':       { label: 'Bebidas',                order: 70, icon: 'drinks' },
  'desserts':     { label: 'Sobremesas',             order: 80, icon: 'desserts' },
};

/** Sub-category titles & icons for Bebidas section */
export const drinkSubLabels: Record<string, { label: string; icon: string }> = {
  'aguas-frescas': { label: 'Águas Frescas', icon: '🍹' },
  'cocktails':     { label: 'Cocktails',     icon: '🍸' },
  'softdrinks':    { label: 'Softdrinks',    icon: '🥤' },
  'cafes':         { label: 'Cafés',         icon: '☕' },
};

type MenuItem = CollectionEntry<'menu_items'>;

/** Filter to available items, sort by category order then item order, group by category, sort categories by display order */
export function getSortedGroupedMenu(allItems: MenuItem[]) {
  const menuItems = allItems
    .filter((item) => item.data.available !== false)
    .sort((a, b) => {
      const catA = categoryConfig[a.data.category]?.order ?? 99;
      const catB = categoryConfig[b.data.category]?.order ?? 99;
      if (catA !== catB) return catA - catB;
      return (a.data.order ?? 0) - (b.data.order ?? 0);
    });

  const grouped = menuItems.reduce<Record<string, typeof menuItems>>((acc, item) => {
    const cat = item.data.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const sortedCategories = Object.entries(grouped).sort(
    ([a], [b]) => (categoryConfig[a]?.order ?? 99) - (categoryConfig[b]?.order ?? 99)
  );

  return { menuItems, grouped, sortedCategories };
}
