const input = document.getElementById("search-input") as HTMLInputElement;
const noResults = document.getElementById("no-results") as HTMLParagraphElement;
const postWrappers = document.querySelectorAll<HTMLElement>(".post-wrapper");

input.addEventListener("input", () => {
  const query = input.value.toLowerCase();

  if (query === "") {
    postWrappers.forEach((w) => w.classList.add("hidden"));
    noResults.classList.add("hidden");
    return;
  }

  let foundAny = false;

  postWrappers.forEach((wrapper) => {
    const username = wrapper.dataset.username!.toLowerCase();
    const content = wrapper.dataset.content!.toLowerCase();
    const matches = username.includes(query) || content.includes(query);
    wrapper.classList.toggle("hidden", !matches);
    if (matches) foundAny = true;
  });

  noResults.classList.toggle("hidden", foundAny);
});
