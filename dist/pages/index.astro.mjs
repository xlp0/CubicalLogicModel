/* empty css                                         */
import { c as createComponent, a as createAstro, r as renderTemplate, e as addAttribute, b as renderHead, f as renderSlot, m as maybeRenderHead, d as renderComponent, u as unescapeHTML, F as Fragment } from '../chunks/astro/server_XM5ODgE2.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export { renderers } from '../renderers.mjs';

const $$Astro$3 = createAstro();
const $$LandingLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$LandingLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Interactive learning platform"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body class="font-sans antialiased"> <header class="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200"> <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between h-16"> <div class="flex items-center"> <a href="/" class="text-xl font-bold text-gray-900">
GASing
</a> </div> <div class="flex items-center space-x-8"> <a href="#features" class="text-gray-600 hover:text-gray-900">Features</a> <a href="#courses" class="text-gray-600 hover:text-gray-900">Courses</a> <a href="#about" class="text-gray-600 hover:text-gray-900">About</a> <a href="/cubical-model" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
Get Started
</a> </div> </div> </nav> </header> ${renderSlot($$result, $$slots["default"])} <footer class="bg-gray-900 text-white py-12"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="grid grid-cols-1 md:grid-cols-4 gap-8"> <div> <h3 class="text-lg font-semibold mb-4">GASing</h3> <p class="text-gray-400">The Easy, Fun, and Interesting way to Learn.</p> </div> <div> <h3 class="text-lg font-semibold mb-4">Resources</h3> <ul class="space-y-2 text-gray-400"> <li><a href="#" class="hover:text-white">Documentation</a></li> <li><a href="#" class="hover:text-white">Tutorials</a></li> <li><a href="#" class="hover:text-white">Blog</a></li> </ul> </div> <div> <h3 class="text-lg font-semibold mb-4">Organization</h3> <ul class="space-y-2 text-gray-400"> <li><a href="#" class="hover:text-white">About Us</a></li> <li><a href="#" class="hover:text-white">Careers</a></li> <li><a href="#" class="hover:text-white">Contact</a></li> </ul> </div> <div> <h3 class="text-lg font-semibold mb-4">Legal</h3> <ul class="space-y-2 text-gray-400"> <li><a href="#" class="hover:text-white">Privacy Policy</a></li> <li><a href="#" class="hover:text-white">Terms of Service</a></li> </ul> </div> </div> <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"> <p>&copy; 2024 GASing. All rights reserved.</p> </div> </div> </footer> </body></html>`;
}, "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/layouts/LandingLayout.astro", void 0);

const $$Astro$2 = createAstro();
const $$Hero = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Hero;
  const { title, subtitle } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white py-32 overflow-hidden"> <!-- Background Pattern --> <div class="absolute inset-0 opacity-10"> <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\" 60\" height="\&quot;60\&quot;" viewBox="\&quot;0" 0 60 60\" xmlns="\&quot;http://www.w3.org/2000/svg\&quot;%3E%3Cg" fill="\&quot;none\&quot;" fill-rule="\&quot;evenodd\&quot;%3E%3Cg" fill="\&quot;%23ffffff\&quot;" fill-opacity="\&quot;1\&quot;%3E%3Cpath" d="\&quot;M36" 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\" %3E%3C g%3E%3C g%3E%3C svg%3E');"></div> </div> <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center"> <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight"> ${title} </h1> <p class="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto"> ${subtitle} </p> <a href="/cubical-model" class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
Get Started
<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </a> </div> </div> </section>`;
}, "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/components/landing/Hero.astro", void 0);

const $$Astro$1 = createAstro();
const $$FeatureCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FeatureCard;
  const { icon, title, description } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="bg-white rounded-lg shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-200"> <div class="text-blue-600 mb-4 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(icon)}` })} </div> <h3 class="text-xl font-semibold text-gray-900 mb-2"> ${title} </h3> <p class="text-gray-600"> ${description} </p> </div>`;
}, "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/components/CardContent/FeatureCard.astro", void 0);

async function readSvgFile(filename) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, "../../public/icons", filename);
  return await readFile(filePath, "utf-8");
}

const features = [
	{
		title: "Interactive 3D Learning",
		description: "Explore complex concepts through an interactive 3D cube interface that brings abstract ideas to life.",
		iconFile: "3d-cube.svg"
	},
	{
		title: "Dynamic Content Loading",
		description: "Experience seamless content transitions with our Monad-inspired component architecture.",
		iconFile: "dynamic-loading.svg"
	},
	{
		title: "Split-View Interface",
		description: "Customize your learning environment with resizable panels for optimal content organization.",
		iconFile: "split-view.svg"
	}
];
const featuresData = {
	features: features
};

const $$Features = createComponent(async ($$result, $$props, $$slots) => {
  const features = await Promise.all(
    featuresData.features.map(async (feature) => ({
      ...feature,
      icon: await readSvgFile(feature.iconFile)
    }))
  );
  return renderTemplate`${maybeRenderHead()}<section class="py-20 bg-gray-50"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-16"> <h2 class="text-4xl font-bold text-gray-900 mb-4">
Modern Learning Experience
</h2> <p class="text-xl text-gray-600 max-w-3xl mx-auto">
Discover a new way of understanding complex concepts through our innovative 3D interface and dynamic content delivery system.
</p> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> ${features.map((feature) => renderTemplate`${renderComponent($$result, "FeatureCard", $$FeatureCard, { "icon": feature.icon, "title": feature.title, "description": feature.description })}`)} </div> </div> </section>`;
}, "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/components/landing/Features.astro", void 0);

const $$Astro = createAstro();
const $$CourseCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CourseCard;
  const { title, description, icon, link, featured = false, coming = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-200"> <div class="relative pt-[60%] bg-gray-50"> <div class="absolute inset-0 p-8">${unescapeHTML(icon)}</div> </div> <div class="p-6"> <div class="flex items-center justify-between mb-2"> <h3 class="text-xl font-semibold text-gray-900"> ${title} </h3> ${featured && renderTemplate`<span class="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
Featured
</span>`} ${coming && renderTemplate`<span class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
Coming Soon
</span>`} </div> <p class="text-gray-600 mb-4"> ${description} </p> <a${addAttribute(link, "href")}${addAttribute(`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md 
        ${featured ? "text-white bg-blue-600 hover:bg-blue-700" : "text-gray-700 bg-gray-100 hover:bg-gray-200"}`, "class")}> ${featured ? "Get Started" : "Learn More"} <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path> </svg> </a> </div> </div>`;
}, "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/components/CardContent/CourseCard.astro", void 0);

const courses = [
	{
		title: "Cubical Logic Model",
		description: "Explore logical concepts through an interactive 3D interface inspired by Leibniz's Monadology.",
		iconFile: "cubical-logic.svg",
		link: "/cubical-model",
		featured: true
	},
	{
		title: "Introduction to Logic",
		description: "Learn the fundamentals of logical reasoning and argumentation.",
		iconFile: "intro-logic.svg",
		link: "#",
		coming: true
	},
	{
		title: "Advanced Topics",
		description: "Dive deep into advanced logical concepts and their applications.",
		iconFile: "advanced-topics.svg",
		link: "#",
		coming: true
	}
];
const coursesData = {
	courses: courses
};

const $$Courses = createComponent(async ($$result, $$props, $$slots) => {
  const courses = await Promise.all(
    coursesData.courses.map(async (course) => ({
      ...course,
      icon: await readSvgFile(course.iconFile)
    }))
  );
  return renderTemplate`${maybeRenderHead()}<section id="courses" class="py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="text-center mb-16"> <h2 class="text-4xl font-bold text-gray-900 mb-4">
Available Courses
</h2> <p class="text-xl text-gray-600 max-w-3xl mx-auto">
Start your journey into logical reasoning with our interactive courses
</p> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"> ${courses.map((course) => renderTemplate`${renderComponent($$result, "CourseCard", $$CourseCard, { ...course })}`)} </div> </div> </section>`;
}, "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/components/landing/Courses.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "LandingLayout", $$LandingLayout, { "title": "GASing - Interactive Learning Platform", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Hero", $$Hero, { "title": "Learn Logic Through Interactive 3D", "subtitle": "Experience a revolutionary approach to understanding logical concepts through our innovative 3D visualization platform", "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "Features", $$Features, { "data-astro-cid-j7pv25f6": true })} ${renderComponent($$result2, "Courses", $$Courses, { "data-astro-cid-j7pv25f6": true })} </main> ` })} `;
}, "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/pages/index.astro", void 0);

const $$file = "/Users/bkoo/Documents/Development/AIProjects/GeneratedCodeBase/CubicalLogicModel/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
