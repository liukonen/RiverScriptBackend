const dit = require("node-duckduckgo");
const axios = require("axios").default;

module.exports.GetInfo = async function(request) {
  let result = await dit.duckIt(request, { noHtml: true });
  console.log("hit");
  if (result.data.AbstractText != "") {
    return "I found on Duck Duck go, that " + result.data.AbstractText;
  } else if (result.data.AbstractURL != "") {
    return (
      "I found something from Duck Duck Go on " +
      result.data.AbstractSource +
      " " +
      result.data.Heading +
      " " +
      result.data.AbstractURL
    );
  }

  return result.data.AbstractSource;
};
