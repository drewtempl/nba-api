// example string: Russell Westbrook0PG336' 3"200 lbsUCLA$44,211,146
function parser(str) {
  const salObj = /\$/.exec(str);
  let collegeIndex = str.indexOf("lbs");
  let salary = "";
  let college = "";
  if (salObj != null) {
    salary = str.substring(salObj.index + 1);
    college = str.substring(collegeIndex + 3, salObj.index)
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

  const ageObj = /'/.exec(str);
  // console.log(ageObj);
  let age = "";
  if (ageObj != null) {
    age = str.substring(ageObj.index - 3, ageObj.index - 1)
  }
  // console.log(age)

  return {
    firstName: firstName,
    lastName: lastName,
    number: number,
    position: position,
    college: college,
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

parser("Russell Westbrook0PG336'lbsUCLA$44,211,146");
// arrTest("Russell Westbrook20PG33lbsUCLA$44,211,146")

module.exports = parser;
