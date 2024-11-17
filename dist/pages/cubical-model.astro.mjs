/* empty css                                         */
import { c as createComponent, a as createAstro, r as renderTemplate, b as renderHead, d as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_XM5ODgE2.mjs';
import 'kleur/colors';
/* empty css                                         */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Cubical Logic Model - An interactive 3D cube interface"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title>${renderHead()}</head> <body class="h-screen bg-gray-900"> ${renderComponent($$result, "SplitPane", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/components/SplitLayout/SplitPane", "client:component-export": "default" })} </body></html>`;
}, "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/layouts/Layout.astro", void 0);

const $$CubicalModel = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Cubical Logic Model", "data-astro-cid-eyz6ayj3": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="split-container" data-astro-cid-eyz6ayj3> <div class="split" data-astro-cid-eyz6ayj3> <div class="split-item" data-astro-cid-eyz6ayj3> ${renderComponent($$result2, "WebPageCube", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-eyz6ayj3": true, "client:component-path": "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/components/WebPageCube/WebPageCube", "client:component-export": "default" })} </div> <div class="split-item" data-astro-cid-eyz6ayj3> ${renderComponent($$result2, "Dashboard", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-eyz6ayj3": true, "client:component-path": "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/components/CardContent/Dashboard", "client:component-export": "default" })} </div> <div class="gutter" data-astro-cid-eyz6ayj3></div> </div> </div> ` })}  `;
}, "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/pages/cubical-model.astro", void 0);

const $$file = "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/pages/cubical-model.astro";
const $$url = "/cubical-model";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CubicalModel,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
