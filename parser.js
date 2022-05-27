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
  if (lastObj != null) {
    lastName = str.substring(firstObj.index + 1, lastObj.index);
  }

    return {
        firstName: firstName,
        lastName: lastName,
        salary: salary
    }

}

function arrTest(str) {
    arr = [];
    arr.push(parser(str));
    console.log(arr[0]);
    const obj = arr.find(element => element.firstName == "Russell")
    console.log(obj)
}

// parser("Russell Westbrook0PG33UCLA$44,211,146")
// arrTest("Russell Westbrook0PG33UCLA$44,211,146")


module.exports = parser;
