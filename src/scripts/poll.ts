import { API } from "../config/api";
import { getCookie } from "../utils/cookies";

const userId = getCookie("userId");
if (!userId) window.location.replace("/login");

const pollId = new URLSearchParams(window.location.search).get("id")!;

type Option = { id: string; option: string; votes: number };
type Poll = {
  id: string;
  question: string;
  created_by: string;
  approved: boolean;
  voted_option_id: string | null;
  options: Option[];
};

const backBtn = document.createElement("a");
backBtn.className = "back-btn";
backBtn.href = "/start";
backBtn.textContent = "← back";
document.getElementById("poll-detail")!.before(backBtn);

async function loadPoll() {
  const container = document.getElementById("poll-detail")!;
  container.innerHTML = "";

  const res = await fetch(API.polls.getAll, {
    headers: { Authorization: `Bearer ${userId}` },
  });

  if (!res.ok) {
    container.textContent = "failed to load poll.";
    return;
  }

  const polls: Poll[] = await res.json();
  const poll = polls.find((p) => p.id === pollId);
  if (!poll) {
    container.textContent = "poll not found.";
    return;
  }

  renderPoll(container, poll);
}

function renderPoll(container: HTMLElement, poll: Poll) {
  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
  const hasVoted = poll.voted_option_id !== null;

  const card = document.createElement("div");
  card.className = "poll-card poll-card--detail";

  const question = document.createElement("p");
  question.className = "poll-question";
  question.textContent = poll.question;

  const optionsList = document.createElement("ul");
  optionsList.className = "poll-options";

  for (const opt of poll.options) {
    const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
    const isVoted = opt.id === poll.voted_option_id;
    const li = document.createElement("li");

    if (hasVoted) {
      li.className = `poll-option${isVoted ? " poll-option--voted" : ""}`;
      const bar = document.createElement("div");
      bar.className = "poll-option-bar";
      bar.style.width = "0";
      const label = document.createElement("span");
      label.className = "poll-option-label";
      label.textContent = opt.option;
      const pctSpan = document.createElement("span");
      pctSpan.className = "poll-option-pct";
      pctSpan.textContent = `${pct}%`;
      li.append(bar, label, pctSpan);
    } else {
      li.className = "poll-vote-option";
      li.textContent = opt.option;
      li.addEventListener("click", () => castVote(poll.id, opt.id));
    }

    optionsList.append(li);
  }

  const meta = document.createElement("span");
  meta.className = "poll-meta";
  meta.textContent = `${totalVotes} vote${totalVotes !== 1 ? "s" : ""}`;

  card.append(question, optionsList, meta);
  container.append(card);

  if (hasVoted) {
    const bars = optionsList.querySelectorAll<HTMLElement>(".poll-option-bar");
    const targets = poll.options.map((o) =>
      totalVotes > 0 ? `${Math.round((o.votes / totalVotes) * 100)}%` : "0%"
    );
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bars.forEach((b, i) => (b.style.width = targets[i]));
      });
    });
  }
}

async function castVote(pollId: string, optionId: string) {
  const res = await fetch(API.polls.vote, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userId}`,
    },
    body: JSON.stringify({ poll_id: pollId, option_id: optionId }),
  });

  if (res.ok) setTimeout(loadPoll, 400);
}

loadPoll();
