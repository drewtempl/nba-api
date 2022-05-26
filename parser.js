
// example string: Russell Westbrook0PG336' 3"200 lbsUCLA$44,211,146
function parser(str) {
    const obj = /\$/.exec(str)
    const firstName = str.substring(0, obj.index)
    console.log(firstName)
}

// parser("Russell Westbrook$0PG33")

module.exports = parser;