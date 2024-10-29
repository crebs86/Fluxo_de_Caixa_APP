const validation = () => {};

const length = ({ value, min = null, max = null, field }) => {
  let res = false;
  if (typeof value === "string") {
    res = (!min || value.length >= min) && (!max || value.length <= max);
  }

  if (res) {
    return res;
  } else {
    throw new Error(
      `Campo ${field} deverá ter entre ${!min ? "?" : min} e ${
        !max ? "?" : max
      } catacteres.`
    );
  }
};

const email = (value) => {
  let res = value
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  if (res) {
    return true;
  } else {
    throw new Error("E-mail inválido.");
  }
};

export { validation, length, email };
