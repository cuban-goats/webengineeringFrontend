import { getCookie } from "../utils/cookies";

const userId = getCookie("userId");
const verified = getCookie("verified");

if (userId && verified === "true") {
  window.location.replace("/start");
} else if (userId && verified === "false") {
  window.location.replace("/verify");
} else {
  window.location.replace("/login");
}
