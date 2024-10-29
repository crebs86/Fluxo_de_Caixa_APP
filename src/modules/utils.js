import router from "../router";
import moment from "moment";

function goTo(to) {
  router.push(to);
}

function date(date) {
  return moment(date);
}

export { goTo, date };
