function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Populate dropdown //

async function populateLabelDropdown(artists) {
  const labelDropdown = document.querySelector("#label-dropdown");

  const allOption = document.createElement("option");
  allOption.value = "All";
  allOption.textContent = "All";
  allOption.selected = true;
  labelDropdown.appendChild(allOption);

  const labels = artists.flatMap(artists => artists.labels);

  const uniqueLabels = [...new Set(labels)];

  uniqueLabels.forEach(label => {
    const option = document.createElement("option");
    option.value = label;
    option.textContent = label;
    labelDropdown.appendChild(option);
  });
}

export { scrollToTop, populateLabelDropdown };