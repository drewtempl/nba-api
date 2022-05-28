
function parser(str) {
  const nameObj = /\s/.exec(str);
  const obj = /\d/.exec(str);
  const info = ["", "", ""];

  if (nameObj != null) {
    info[0] = str.substring(0, nameObj.index);

    if (obj != null) {
      info[1] = str.substring(nameObj.index + 1, obj.index);
      info[2] = str.substring(obj.index);
    }

    else {
      info[1] = str.substring(nameObj.index + 1);
    }
  }
  return info;
}

function arrTest(str) {
  arr = [];
  arr.push(parser(str));
  console.log(arr[0]);
  const obj = arr.find((element) => element.firstName == "Russell");
  console.log(obj);
}

// parser("Russell Westbrook0PG336'lbsUCLA$44,211,146");
// arrTest("Russell Westbrook20PG33lbsUCLA$44,211,146")

module.exports = parser2;
