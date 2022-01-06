const container = document.querySelector('.container');

async function getTeams() {
    const response = await fetch('http://localhost:3000/api/teams', {mode: 'cors'});
    const teamsData = await response.json();
    


    // const teamsData = await response.json();
    console.log(teamsData)

    // for (let team in teamsData) {
    //     console.log(team)
    // }

}

getTeams();