import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  // transformerVariantGroup,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  rules: [],
  presets: [presetUno(), presetAttributify()],
  transformers: [transformerDirectives()],
});
