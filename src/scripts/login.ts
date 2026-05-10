import { API } from "../config/api";
import { setCookie } from "../utils/cookies";

const form = document.getElementById("login-form") as HTMLFormElement;
const btn = document.getElementById("submit-btn") as HTMLButtonElement;
const toast = document.getElementById("toast") as HTMLDivElement;

let toastTimer: ReturnType<typeof setTimeout>;

function showToast(message: string) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("toast--visible");
  toastTimer = setTimeout(() => toast.classList.remove("toast--visible"), 4000);
}

function setLoading(loading: boolean) {
  btn.disabled = loading;
  btn.classList.toggle("btn--loading", loading);
  btn.textContent = loading ? "" : "→";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = (document.getElementById("identifier") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  setLoading(true);

  try {
    const response = await fetch(API.auth.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: identifier, password }),
    });

    if (response.ok) {
      const userId = await response.json();
      setCookie("userId", userId);
      setCookie("verified", "true");
      window.location.replace("/");
    } else {
      const body = await response.json().catch(() => null);
      if (body?.detail === "Unverified") {
        window.location.replace("/verify");
      } else {
        showToast(body?.detail ?? "Login failed");
        setLoading(false);
      }
    }
  } catch {
    showToast("Network error — please try again");
    setLoading(false);
  }
});
