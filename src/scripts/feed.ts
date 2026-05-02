import { API } from "../config/api";
import { getCookie } from "../utils/cookies";

const userId = getCookie("userId");
if (!userId) {
  window.location.replace("/login");
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

  const polls: Array<{
    id: string;
    question: string;
    created_by: string;
    approved: boolean;
    voted_option_id: string | null;
    options: Array<{ id: string; option: string; votes: number }>;
  }> = await res.json();

  if (polls.length === 0) {
    feed.innerHTML = `<p class="feed-empty">no polls yet.</p>`;
    return;
  }

  feed.innerHTML = polls
    .map((poll) => {
      const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
      const options = poll.options
        .map((opt) => {
          const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isVoted = opt.id === poll.voted_option_id;
          return `
            <li class="poll-option${isVoted ? " poll-option--voted" : ""}">
              <div class="poll-option-bar" style="width:${pct}%"></div>
              <span class="poll-option-label">${opt.option}</span>
              <span class="poll-option-pct">${pct}%</span>
            </li>`;
        })
        .join("");

      return `
        <a class="poll-card" href="/poll/${poll.id}">
          <p class="poll-question">${poll.question}</p>
          <ul class="poll-options">${options}</ul>
          <span class="poll-meta">${totalVotes} vote${totalVotes !== 1 ? "s" : ""}</span>
        </a>`;
    })
    .join("");
}

loadFeed();
