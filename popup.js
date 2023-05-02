async function groupTabs(domainPattern, groupName, gColor) {
  try {
    const tabs = await chrome.tabs.query({
      url: [domainPattern],
    });
    const collator = new Intl.Collator();
    tabs.sort((a, b) => collator.compare(a.title, b.title));
    const tabIds = tabs.map(({ id }) => id);
    const group = await chrome.tabs.group({ tabIds });
    let updateParams = {
      title: groupName,
      collapsed: true,
      color: gColor,
    };
    chrome.tabGroups.update(group, updateParams);
    localStorage[groupName] = domainPattern;
  } catch (error) {
    document.querySelector("#error").textContent = error;
  }
}

const groupTabsButton = document.querySelector("#group-tabs");
const updateGroupsButton = document.querySelector("#update-groups");

// Group Tabs
groupTabsButton.addEventListener("click", async () => {
  let domainPattern = document.querySelector("#domain-pattern").value;
  let groupName = document.querySelector("#group").value;
  groupTabs(domainPattern, groupName);
});

// Update Groups
updateGroupsButton.addEventListener("click", async () => {
  chrome.tabGroups.query({}, function (groups) {
    groups.forEach(function (group) {
      // A group has following keys: collapsed,color,id,title,windowId
      let gName = group.title;
      let gColor = group.color;
      let gPattern = localStorage[gName];
      groupTabs(gPattern, gName, gColor);
    });
  });
});
