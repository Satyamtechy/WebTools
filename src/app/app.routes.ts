import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'icons',
    loadComponent: () =>
      import('./icons/icons.component').then((m) => m.IconsComponent),
  },
  {
    path: 'css-loaders',
    loadComponent: () =>
      import('./css-loaders/css-loaders.component').then((m) => m.CssLoadersComponent),
  },
  {
    path: 'colors',
    loadComponent: () =>
      import('./features/colors/colors.component').then((m) => m.ColorsComponent),
  },
  {
    path: 'gradients',
    loadComponent: () =>
      import('./features/gradients/gradients.component').then((m) => m.GradientsComponent),
  },
  {
    path: 'shadows',
    loadComponent: () =>
      import('./features/shadows/shadows.component').then((m) => m.ShadowsComponent),
  },
  {
    path: 'radius',
    loadComponent: () =>
      import('./features/radius/radius.component').then((m) => m.RadiusComponent),
  },
  {
    path: 'fonts',
    loadComponent: () =>
      import('./features/fonts/fonts.component').then((m) => m.FontsComponent),
  },
  {
    path: 'meta-tags',
    loadComponent: () =>
      import('./features/meta-tags/meta-tags.component').then((m) => m.MetaTagsComponent),
  },
  {
    path: 'regex',
    loadComponent: () =>
      import('./features/regex/regex.component').then((m) => m.RegexComponent),
  },
  {
    path: 'json',
    loadComponent: () =>
      import('./features/json/json.component').then((m) => m.JsonComponent),
  },
  {
    path: 'code-formatter',
    loadComponent: () =>
      import('./features/code-formatter/code-formatter.component').then((m) => m.CodeFormatterComponent),
  },
  {
    path: 'image-base64',
    loadComponent: () =>
      import('./features/image-base64/image-base64.component').then((m) => m.ImageBase64Component),
  },
  {
    path: 'svg-optimizer',
    loadComponent: () =>
      import('./features/svg-optimizer/svg-optimizer.component').then((m) => m.SvgOptimizerComponent),
  },
  {
    path: 'css-minifier',
    loadComponent: () =>
      import('./features/css-minifier/css-minifier.component').then((m) => m.CssMinifierComponent),
  },
  {
    path: 'tailwind-colors',
    loadComponent: () =>
      import('./features/tailwind-colors/tailwind-colors.component').then((m) => m.TailwindColorsComponent),
  },
  {
    path: 'responsive-tester',
    loadComponent: () =>
      import('./features/responsive-tester/responsive-tester.component').then((m) => m.ResponsiveTesterComponent),
  },
  {
    path: 'transformer',
    loadComponent: () =>
      import('./features/transformer/transformer.component').then((m) => m.TransformerComponent),
  },
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
];
