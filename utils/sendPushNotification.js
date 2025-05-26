async function sendPushNotification(expoPushToken, content) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Good News!",
    body: "Someone Just Scanned Your Lost Item",
    data: content,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
export default sendPushNotification;
