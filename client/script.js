const container = document.querySelector('.container');
const header = document.querySelector('h1');

async function getTeams() {
    const response = await fetch('http://localhost:3000/api/teams', {mode: 'cors'});
    
    console.log(response)
    const teamsData = await response.json();
    console.log(teamsData)

    for (let i = 0; i < teamsData.length; i++) {
        
        let card = document.createElement('div');
        card.textContent = `${teamsData[i].name}`;
        card.classList.toggle('nba-team');

        let image = document.createElement('img');
        image.src = `${teamsData[i].logo}`;
        card.appendChild(image);

        card.addEventListener('click', () => requestTeam(`${teamsData[i].abvr}`));

        container.appendChild(card)

    }

    
    

}


async function requestTeam(teamAbbrev) {
    
    const response = await fetch(`http://localhost:3000/api/teams/${teamAbbrev}`, {mode: 'cors'});
    
    console.log(response)
    const playersData = await response.json();
    console.log(playersData)

    container.style.display = "none";

    const roster = document.querySelector('.roster');

    for (let i = 0; i < playersData.length; i++) {
        
        let card = document.createElement('div');
        card.textContent = `${playersData[i].first_name} ${playersData[i].last_name}`;
        card.classList.toggle('nba-player');
        roster.appendChild(card)
    }

    header.textContent = `${playersData[0].team}`.toUpperCase();
}

getTeams();