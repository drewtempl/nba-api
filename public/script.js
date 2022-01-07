const container = document.querySelector('.container');

async function getTeams() {
    const response = await fetch('http://localhost:3000/api/teams', {mode: 'cors'});
    
    console.log(response)
    const teamsData = await response.json();
    


    // const teamsData = await response.json();
    //console.log(teamsData)

    

    for (let i = 0; i < teamsData.length; i++) {
        
        let card = document.createElement('div');
        card.textContent = `${teamsData[i].team}`;
        card.classList.toggle('nba-team');

        let image = document.createElement('img');
        image.src = `${teamsData[i].logo}`;
        card.appendChild(image);

        card.addEventListener('click', () => requestTeam(`${teamsData[i].abbrev}`));

        container.appendChild(card)

    }

    
    

}


async function requestTeam(teamAbbrev) {
    
    const response = await fetch(`http://localhost:3000/api/teams/${teamAbbrev}`, {mode: 'cors'});
    
    console.log(response)
    const playersData = await response.json();
    console.log(playersData)
}

getTeams();