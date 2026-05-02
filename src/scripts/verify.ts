import { API } from "../config/api";
import { getCookie, setCookie } from "../utils/cookies";

const userId = getCookie("userId");

const btn = document.getElementById("reload-btn") as HTMLButtonElement;

btn.addEventListener("click", async () => {
  if (!userId) {
    window.location.replace("/login");
    return;
  }

  const res = await fetch(`${API.auth.status}?userId=${userId}`);
  if (res.ok) {
    const { verified } = await res.json();
    setCookie("verified", String(verified));
    window.location.replace(verified ? "/" : "/verify");
  } else {
    window.location.replace("/login");
  }
});
