async function groupTabs(domainPattern, groupName) {
  try {
    const tabs = await chrome.tabs.query({
      url: [domainPattern],
    });
    const collator = new Intl.Collator();
    tabs.sort((a, b) => collator.compare(a.title, b.title));
    const tabIds = tabs.map(({ id }) => id);
    const group = await chrome.tabs.group({ tabIds });
    chrome.tabGroups.update(group, { title: groupName });
  } catch (error) {
    document.querySelector("#error").textContent = error;
  }
}

const button = document.querySelector("button");
button.addEventListener("click", async () => {
  let domainPattern = document.querySelector("#domain-pattern").value;
  let groupName = document.querySelector("#group").value;
  groupTabs(domainPattern, groupName);
});
