const year = document.getElementById("year");
const discordName = document.getElementById("discordName");
const copyButton = document.getElementById("copyDiscord");
const copyMessage = document.getElementById("copyMessage");

let feedbackTimeoutId;

year.textContent = String(new Date().getFullYear());

copyButton.addEventListener("click", async () => {
  const username = discordName.textContent.trim();

  try {
    await navigator.clipboard.writeText(username);
    copyButton.textContent = "Copied";
    copyMessage.textContent = "Discord username copied.";
  } catch (error) {
    copyMessage.textContent = `Could not copy automatically. Username: ${username}`;
  }

  clearTimeout(feedbackTimeoutId);
  feedbackTimeoutId = setTimeout(() => {
    copyButton.textContent = "Copy Username";
    copyMessage.textContent = "";
  }, 1700);
});
