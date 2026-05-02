import { API } from "../config/api";
import { setCookie } from "../utils/cookies";

const form = document.getElementById("login-form") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const identifier = (document.getElementById("identifier") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

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
      alert(body?.detail ?? "Login failed");
    }
  }
});
