
if ("serviceWorker" in navigator && location.hostname !== "localhost") {
  navigator.serviceWorker.register("/sw.js");
}

