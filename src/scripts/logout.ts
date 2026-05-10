import { deleteCookie } from "../utils/cookies";

deleteCookie("userId");
deleteCookie("verified");
window.location.replace("/login");
