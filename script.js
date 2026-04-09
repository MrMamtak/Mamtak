const year = document.getElementById("year");
const discordName = document.getElementById("discordName");
const copyButton = document.getElementById("copyDiscord");
const copyMessage = document.getElementById("copyMessage");
const modrinthProjects = document.getElementById("modrinthProjects");
const modrinthDownloads = document.getElementById("modrinthDownloads");
const modrinthLiveStatus = document.getElementById("modrinthLiveStatus");
const bestProjectLink = document.getElementById("bestProjectLink");
const bestProjectImage = document.getElementById("bestProjectImage");
const bestProjectTitle = document.getElementById("bestProjectTitle");
const bestProjectDescription = document.getElementById("bestProjectDescription");

let feedbackTimeoutId;

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1
});

function formatCompactNumber(value) {
  return compactFormatter.format(value);
}

function getProjectUrl(project) {
  return `https://modrinth.com/${project.project_type}/${project.slug}`;
}

function getTopProject(projects) {
  return [...projects].sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0))[0];
}

async function loadModrinthData() {
  if (!modrinthProjects || !modrinthDownloads) {
    return;
  }

  if (modrinthLiveStatus) {
    modrinthLiveStatus.textContent = "Loading live Modrinth data...";
  }

  try {
    const response = await fetch("https://api.modrinth.com/v2/user/mamtak/projects", {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Modrinth API error ${response.status}`);
    }

    const projects = await response.json();
    const totalDownloads = projects.reduce(
      (sum, project) => sum + (typeof project.downloads === "number" ? project.downloads : 0),
      0
    );

    modrinthProjects.textContent = String(projects.length);
    modrinthDownloads.textContent = formatCompactNumber(totalDownloads);

    const topProject = getTopProject(projects);
    if (topProject && bestProjectLink && bestProjectImage && bestProjectTitle && bestProjectDescription) {
      bestProjectLink.href = getProjectUrl(topProject);
      bestProjectTitle.textContent = topProject.title;
      bestProjectDescription.textContent = topProject.description || "Top project on Modrinth.";
      if (topProject.icon_url) {
        bestProjectImage.src = topProject.icon_url;
        bestProjectImage.alt = `${topProject.title} icon from Modrinth`;
      }
    }

    if (modrinthLiveStatus) {
      const now = new Date();
      modrinthLiveStatus.textContent = `Live stats updated at ${now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })}.`;
    }
  } catch (error) {
    if (modrinthLiveStatus) {
      modrinthLiveStatus.textContent = "Live Modrinth data is unavailable right now.";
    }
    console.error("Failed to load Modrinth data:", error);
  }
}

loadModrinthData();
setInterval(loadModrinthData, 5 * 60 * 1000);

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
