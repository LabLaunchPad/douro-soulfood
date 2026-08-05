import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    // ── Menu Items ──
    // Angela can add/edit/remove items via /keystatic admin.
    // Categories map to the D'ouro menu structure.
    // Price stored in EUR cents (e.g. 1490 = €14.90) to avoid floating-point issues.
    // Using JSON format for compatibility with Astro v6 glob loader.
    menu_items: collection({
      label: 'Menu Items',
      slugField: 'title',
      path: 'src/content/menu-items/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Dish Name', validation: { length: { min: 1 } } } }),
        description: fields.text({
          label: 'Description (German)',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        descriptionEn: fields.text({
          label: 'Description (English)',
          multiline: true,
        }),
        price: fields.integer({
          label: 'Price (EUR cents)',
          validation: { min: 0 },
        }),
        image: fields.image({
          label: 'Dish Photo',
          directory: 'public/images/menu',
          publicPath: '/images/menu',
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Vorspeisen / Entradas', value: 'appetizers' },
            { label: 'Quesadillas', value: 'quesadillas' },
            { label: 'Tacos', value: 'tacos' },
            { label: 'Bowls', value: 'bowls' },
            { label: 'Pratos Feitos', value: 'mains' },
            { label: 'Pratos Do Mar', value: 'seafood' },
            { label: 'Beilagen / Sides', value: 'sides' },
            { label: 'Bebidas', value: 'drinks' },
            { label: 'Sobremesas', value: 'desserts' },
          ],
          defaultValue: 'bowls',
        }),
        subCategory: fields.select({
          label: 'Drink Sub-Category (Bebidas only)',
          options: [
            { label: 'Águas Frescas', value: 'aguas-frescas' },
            { label: 'Cocktails', value: 'cocktails' },
            { label: 'Softdrinks', value: 'softdrinks' },
            { label: 'Cafés', value: 'cafes' },
          ],
          defaultValue: 'softdrinks',
        }),
        dietary: fields.multiselect({
          label: 'Dietary Tags',
          options: [
            { label: 'Vegan', value: 'vegan' },
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'Gluten-Free', value: 'gluten-free' },
            { label: 'Spicy', value: 'spicy' },
            { label: 'Halal', value: 'halal' },
            { label: 'Dairy-Free', value: 'dairy-free' },
          ],
        }),
        order: fields.integer({
          label: 'Display Order (lower = first)',
          defaultValue: 0,
          validation: { min: 0 },
        }),
        featured: fields.checkbox({
          label: 'Featured on Homepage',
          defaultValue: false,
        }),
        available: fields.checkbox({
          label: 'Currently Available',
          defaultValue: true,
        }),
        prepTime: fields.text({
          label: 'Prep Time (German)',
        }),
        prepTimeEn: fields.text({
          label: 'Prep Time (English)',
        }),
        allergens: fields.array(
          fields.text({ label: 'Allergen Code' }),
          {
            label: 'Allergens',
            itemLabel: (props) => props.value || 'Allergen',
          }
        ),
        addOns: fields.array(
          fields.object({
            label: fields.text({ label: 'Add-on Label' }),
            price: fields.integer({ label: 'Add-on Price (EUR cents)', validation: { min: 0 } }),
          }),
          {
            label: 'Add-ons',
            itemLabel: (props) => props.fields.label.value || 'Add-on',
          }
        ),
        priceVariants: fields.object(
          {
            nonAlcoholic: fields.integer({ label: 'Non-Alcoholic Price (EUR cents)', validation: { min: 0 } }),
            alcoholic: fields.integer({ label: 'Alcoholic Price (EUR cents)', validation: { min: 0 } }),
          },
          { label: 'Price Variants (alcoholic/non-alcoholic drinks only)' }
        ),
      },
    }),

    // ── FAQ ──
    faq: collection({
      label: 'FAQ',
      slugField: 'question',
      path: 'src/content/faq/*',
      format: { data: 'json' },
      schema: {
        question: fields.slug({ name: { label: 'Question', validation: { length: { min: 1 } } } }),
        answer: fields.text({
          label: 'Answer',
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        order: fields.integer({
          label: 'Display Order',
          defaultValue: 0,
        }),
      },
    }),
  },
  singletons: {
    // ── Site Settings ──
    settings: singleton({
      label: 'Site Settings',
      path: 'src/content/settings/default',
      format: { data: 'json' },
      schema: {
        site_name: fields.text({ label: 'Site Name', validation: { length: { min: 1 } } }),
        tagline: fields.text({ label: 'Tagline' }),
        phone: fields.text({ label: 'Phone' }),
        email: fields.text({ label: 'Email' }),
        address_line1: fields.text({ label: 'Address Line 1' }),
        address_line2: fields.text({ label: 'Address Line 2' }),
        city: fields.text({ label: 'City' }),
        postal_code: fields.text({ label: 'Postal Code' }),
        country: fields.text({ label: 'Country' }),
        google_maps_url: fields.url({ label: 'Google Maps URL' }),
        lieferando_url: fields.url({ label: 'Lieferando Order URL' }),
        logo: fields.image({
          label: 'Logo',
          directory: 'public/images',
          publicPath: '/images',
        }),
        og_image: fields.image({
          label: 'Default OG Image',
          directory: 'public/images',
          publicPath: '/images',
        }),
        social: fields.object({
          label: 'Social Links',
          fields: {
            instagram: fields.url({ label: 'Instagram URL' }),
            facebook: fields.url({ label: 'Facebook URL' }),
            tiktok: fields.url({ label: 'TikTok URL' }),
            tripadvisor: fields.url({ label: 'TripAdvisor URL' }),
          },
        }),
        hours: fields.array(
          fields.object({
            label: 'Hours Entry',
            fields: {
              day: fields.text({ label: 'Day', validation: { length: { min: 1 } } }),
              time: fields.text({ label: 'Hours', validation: { length: { min: 1 } } }),
            },
          }),
          { label: 'Operating Hours', itemLabel: (props) => props.fields.day.value }
        ),
      },
    }),

    // ── Home Page ──
    home: singleton({
      label: 'Home Page',
      path: 'src/content/pages/home',
      format: { data: 'json' },
      schema: {
        hero_headline: fields.text({ label: 'Hero Headline', validation: { length: { min: 1 } } }),
        hero_subheadline: fields.text({ label: 'Hero Sub-headline' }),
        hero_cta_primary_label: fields.text({ label: 'Primary CTA Label' }),
        hero_cta_primary_href: fields.text({ label: 'Primary CTA Link' }),
        hero_cta_secondary_label: fields.text({ label: 'Secondary CTA Label' }),
        hero_cta_secondary_href: fields.text({ label: 'Secondary CTA Link' }),
        hero_images: fields.array(
          fields.object({
            label: 'Carousel Image',
            fields: {
              src: fields.image({
                label: 'Image',
                directory: 'public/images/hero',
                publicPath: '/images/hero',
              }),
              alt: fields.text({ label: 'Alt Text' }),
            },
          }),
          { label: 'Hero Carousel Images', itemLabel: (props) => props.fields.alt.value || 'Image' }
        ),
        gallery_title: fields.text({ label: 'Gallery Title' }),
        gallery_subtitle: fields.text({ label: 'Gallery Subtitle' }),
        gallery_images: fields.array(
          fields.object({
            label: 'Gallery Image',
            fields: {
              src: fields.image({
                label: 'Image',
                directory: 'public/images/gallery',
                publicPath: '/images/gallery',
              }),
              alt: fields.text({ label: 'Alt Text' }),
            },
          }),
          { label: 'Gallery Images', itemLabel: (props) => props.fields.alt.value || 'Image' }
        ),
        catering_title: fields.text({ label: 'Catering Section Title' }),
        catering_description: fields.text({ label: 'Catering Description', multiline: true }),
        catering_cta_label: fields.text({ label: 'Catering CTA Label' }),
        catering_cta_href: fields.text({ label: 'Catering CTA Link' }),
        catering_image: fields.image({
          label: 'Catering Image',
          directory: 'public/images',
          publicPath: '/images',
        }),
        story_title: fields.text({ label: 'Story Section Title' }),
        story_description: fields.text({ label: 'Story Description', multiline: true }),
        story_cta_label: fields.text({ label: 'Story CTA Label' }),
        story_cta_href: fields.text({ label: 'Story CTA Link' }),
        story_image: fields.image({
          label: 'Story Image',
          directory: 'public/images',
          publicPath: '/images',
        }),
      },
    }),
  },
});
