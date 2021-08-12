import getCanonicalUrl from "./get";

function moveToCanonicalUrl() {
  location.href = getCanonicalUrl();
}

moveToCanonicalUrl();
