function isHTMLLinkElement(el: Element): el is HTMLLinkElement {
  return "href" in el;
}

export default function getCanonicalUrl() {
  const canonical = document.querySelector('link[rel="canonical"]');
  if (
    canonical === null ||
    !isHTMLLinkElement(canonical) ||
    canonical.href === undefined
  ) {
    throw new Error("canonical URL is unspecified");
  }
  return canonical.href;
}
