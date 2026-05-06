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

  const question = document.createElement("p");
  question.className = "poll-question";
  question.textContent = poll.question;

  const optionsList = document.createElement("ul");
  optionsList.className = "poll-detail-options";

  const voteMsg = document.createElement("p");
  voteMsg.className = "vote-msg";
  voteMsg.textContent = hasVoted ? "you already voted." : "";

  for (const opt of poll.options) {
    const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
    const isVoted = opt.id === poll.voted_option_id;

    const li = document.createElement("li");
    li.textContent = `${opt.option}${isVoted ? " ✓" : ""} — ${pct}% (${opt.votes})`;

    if (!hasVoted) {
      li.className = "poll-detail-option--clickable";
      li.addEventListener("click", () => vote(poll.id, opt.id, voteMsg));
    }

    optionsList.append(li);
  }

  const meta = document.createElement("span");
  meta.className = "poll-meta";
  meta.textContent = `${totalVotes} vote${totalVotes !== 1 ? "s" : ""}`;

  container.append(question, optionsList, meta, voteMsg);
}

async function vote(pollId: string, optionId: string, voteMsg: HTMLElement) {
  const res = await fetch(API.polls.vote, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userId}`,
    },
    body: JSON.stringify({ poll_id: pollId, option_id: optionId }),
  });

  if (res.ok) {
    voteMsg.textContent = "vote registered!";
    setTimeout(loadPoll, 600);
  } else {
    const body = await res.json().catch(() => null);
    voteMsg.textContent = body?.detail ?? "vote failed.";
  }
}

loadPoll();
