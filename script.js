const year = document.getElementById("year");
const discordName = document.getElementById("discordName");
const copyButton = document.getElementById("copyDiscord");
const copyMessage = document.getElementById("copyMessage");
const navMessage = document.getElementById("navMessage");
const redirectLinks = document.querySelectorAll(".redirect-link");

let feedbackTimeoutId;

if (year) {
  year.textContent = String(new Date().getFullYear());
}

redirectLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetName = link.dataset.redirectName || "the link";

    if (navMessage) {
      navMessage.textContent = `Redirecting to ${targetName}...`;
    }
  });
});

if (copyButton && discordName && copyMessage) {
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
      copyButton.textContent = "Copy Discord Username";
      copyMessage.textContent = "";
    }, 1700);
  });
}
