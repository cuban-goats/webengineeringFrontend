import { API } from "../config/api";
import { getCookie } from "../utils/cookies";

const userId = getCookie("userId");
if (!userId) {
  window.location.replace("/login");
}

type Poll = {
  id: string;
  question: string;
  created_by: string;
  creator_username: string | null;
  created_at: string | null;
  approved: boolean;
  voted_option_id: string | null;
  options: Array<{ id: string; option: string; votes: number }>;
};

let allPolls: Poll[] = [];

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function totalVotes(poll: Poll): number {
  return poll.options.reduce((s, o) => s + o.votes, 0);
}

function renderPoll(poll: Poll): string {
  const total = totalVotes(poll);
  const options = poll.options
    .map((opt) => {
      const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
      const isVoted = opt.id === poll.voted_option_id;
      return `
        <li class="poll-option${isVoted ? " poll-option--voted" : ""}">
          <div class="poll-option-bar" style="width:${pct}%"></div>
          <span class="poll-option-label">${opt.option}</span>
          <span class="poll-option-pct">${pct}%</span>
        </li>`;
    })
    .join("");

  const meta = [
    `${total} vote${total !== 1 ? "s" : ""}`,
    poll.creator_username ? `by ${poll.creator_username}` : "",
    poll.created_at ? formatDate(poll.created_at) : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return `
    <a class="poll-card" href="/poll?id=${poll.id}">
      <p class="poll-question">${poll.question}</p>
      <ul class="poll-options">${options}</ul>
      <span class="poll-meta">${meta}</span>
    </a>`;
}

function applyFilters() {
  const sort = (document.getElementById("filter-sort") as HTMLSelectElement).value;
  const voted = (document.getElementById("filter-voted") as HTMLInputElement).checked;

  const feed = document.getElementById("feed")!;

  let polls = [...allPolls];

  if (voted) {
    polls = polls.filter((p) => p.voted_option_id !== null);
  }

  if (sort === "oldest") {
    polls = polls.slice().reverse();
  } else if (sort === "popular") {
    polls = polls.slice().sort((a, b) => totalVotes(b) - totalVotes(a));
  }

  if (polls.length === 0) {
    feed.innerHTML = `<p class="feed-empty">no polls match.</p>`;
    return;
  }

  feed.innerHTML = polls.map(renderPoll).join("");
}

async function loadFeed() {
  const res = await fetch(API.polls.getAll, {
    headers: { Authorization: `Bearer ${userId}` },
  });

  const feed = document.getElementById("feed")!;

  if (!res.ok) {
    feed.innerHTML = `<p class="feed-error">failed to load polls.</p>`;
    return;
  }

  allPolls = await res.json();

  if (allPolls.length === 0) {
    feed.innerHTML = `<p class="feed-empty">no polls yet.</p>`;
    return;
  }

  applyFilters();

  document.getElementById("filter-sort")?.addEventListener("change", applyFilters);
  document.getElementById("filter-voted")?.addEventListener("change", applyFilters);
}

loadFeed();
