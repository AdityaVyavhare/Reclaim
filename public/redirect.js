// Get the itemId from the URL
const itemId = new URLSearchParams(window.location.search).get("itemId");

const appLink = `reclaim://?itemId=${itemId}`;
const apkLink = "https://expo.dev/artifacts/eas/daB8QmhSHWKofbuY4zgCie.apk";

// Try to open the app
window.location.href = appLink;

// If the app is NOT installed, redirect to APK link after 2 seconds
setTimeout(() => {
  window.location.href = apkLink;
}, 2000);
