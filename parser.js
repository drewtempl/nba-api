// example string: Russell Westbrook0PG336' 3"200 lbsUCLA$44,211,146
function parser(str) {
  const salObj = /\$/.exec(str);
  let salary = "";
  if (salObj != null) {
    salary = str.substring(salObj.index + 1);
  }

  const firstObj = /\s/.exec(str);
  let firstName = "";
  if (firstObj != null) {
    firstName = str.substring(0, firstObj.index);
  }

  const lastObj = /\d/.exec(str);
  let lastName = "";
  let noName = "";
  if (lastObj != null) {
    lastName = str.substring(firstObj.index + 1, lastObj.index);
    noName = str.substring(lastObj.index);
  }

  const numObj = /[0-9]+|[0-9]+[0-9]/.exec(str);
  let number = "";
  if (numObj != null) {
      number = numObj[0];
  }

  const posObj = /PG|SG|SF|PF|C/.exec(noName);
  let position = "";
  if (posObj != null) {
      position = posObj[0];
  }

  return {
    firstName: firstName,
    lastName: lastName,
    number: number,
    position: position,
    salary: salary,
  };
}

function arrTest(str) {
  arr = [];
  arr.push(parser(str));
  console.log(arr[0]);
  const obj = arr.find((element) => element.firstName == "Russell");
  console.log(obj);
}

// console.log(parser("Russell Westbrook0PG336UCLA$44,211,146"));
// arrTest("Russell Westbrook20PG33UCLA$44,211,146")

module.exports = parser;
