import { collection, getDocs, addDoc, getDoc, updateDoc, doc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "../app/firebase-config";
import TeamsList from "@/components/TeamsList";

let points = {
  "1": 10,
  "2": 8,
  "3": 6,
  "4": 5,
  "5-8": 3,
  "Gr3" : 2,
  "Gr4-5" : 1
}

export async function createGame(gamesCollectionRef, team1name, team1id, team2name, team2id, datetime, field, division, gamename){
  let game = 
  {
    Team1Name: team1name,
    Team1ID: team1id,
    Team2Name: team2name,
    Team2ID: team2id,
    Team1Score: 0,
    Team2Score: 0,
    Status: 0,
    WNextGame: "",
    LNextGame: "",
    DateTime: datetime,
    Field: field,
    Division: division,
    GameName: gamename,
  }

  await addDoc(gamesCollectionRef, game);
}

function convertDateToMinutes(day, hour, minute){
  const originDay = 23;
  let days = parseInt(day) - originDay;

  return days*1440 + parseInt(hour)*60 + parseInt(minute);
}

export function convertMinutesToDate(dateTime){
  let monthMap = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "Maj",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Okt",
    10: "Nov",
    11: "Dec"
  }

  const date = dateTime.toDate()
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let day = date.getDate();
  let month = monthMap[date.getMonth()];
  if(minutes < 10){
    minutes = "0" + minutes.toString()
  }
  let year = date.getFullYear();
  return [hour, minutes, day, month, year];
}

async function advanceTeams(game, team1ID, team2ID){
  //Beräkna förloraren och vinnaren
  let winnerId = "";
  let winnerName = "";
  let loserId = "";
  let loserName = "";
  let winnerScore = 0;
  let loserScore = 0;
  let isPosOneWinner = false;

  let scoreDiff = game.Team1Score - game.Team2Score;
  if(scoreDiff > 0){
    winnerId = team1ID;
    winnerName = game.Team1Name;
    winnerScore = game.Team1Score;
    isPosOneWinner = true;
    loserId = team2ID;
    loserName = game.Team2Name;
    loserScore = game.Team2Score;
  } else{
    winnerId = team2ID;
    winnerName = game.Team2Name;
    winnerScore = game.Team2Score;
    isPosOneWinner = false;
    loserId = team1ID;
    loserName = game.Team1Name;
    loserScore = game.Team1Score;
  }

  //Dra ner matcherna som ska skickas till
  if(game.WNextGame.length > 0){
    let winRef = doc(db, "Games", game.WNextGame[0]);
    let wRes = await getDoc(winRef);
    let wGame = {...wRes.data(), id: wRes.id}  

    //Dra ner alla lag kopplade till matchen
    const teamGameRef = collection(db, "TeamGame");
    let teamGameW = [];
    const q = query(teamGameRef, where("GameID", "==", wGame.id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        teamGameW.push({ ...doc.data(), id: doc.id });
    });

    //Kolla så den är ostartad
    if(wGame.Status == 0){
      //Kolla så att id är tomt i matchen annars måste det hanteras
      
      let idToRemove = "";

      for(let i in teamGameW){
        if(teamGameW[i].TeamPosition == game.WNextGame[1]){
          idToRemove = teamGameW[i].id;
        }
      }

      if(idToRemove != ""){
        //Ta bort matchen från det laget
        let removeRef = doc(db, "TeamGame", idToRemove);
        await deleteDoc(removeRef);
      }
      //Lägg in lag
      //Wgame
      if(game.WNextGame[1] == 1){
        await updateDoc(winRef, {
          Team1Name: winnerName
        })
      }else if(game.WNextGame[1] == 2){
        await updateDoc(winRef, {
          Team2Name: winnerName
        })
      }
      
      let teamGameObj = {
        TeamID: winnerId,
        GameID: wGame.id,
        TeamPosition: game.WNextGame[1],
      }

      await addDoc(teamGameRef, teamGameObj);
      // Kolla om det finns en bracket game på nästa match
      let gameID   = game.WNextGame[0];
      let teamPos  = game.WNextGame[1];
      let teamID   = winnerId;
      let teamName = winnerName;
      let isWinner = true;
      let bracketItemID = game.id;

      await advanceToBracketItem(gameID, teamPos, teamID, teamName, isWinner);
      await updatePlayedBracketItem(bracketItemID, isPosOneWinner);
    }
  }
  
  if(game.LNextGame.length > 0){
    if(game.LNextGame[1] != 3){
      let lossRef = doc(db, "Games", game.LNextGame[0]);
      let lRes = await getDoc(lossRef);
      let lGame = {...lRes.data(), id: lRes.id}
      
      //Dra ner alla lag kopplade till matchen
      const teamGameRef = collection(db, "TeamGame");
      let teamGameL = [];
      const q = query(teamGameRef, where("GameID", "==", lGame.id));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
          teamGameL.push({ ...doc.data(), id: doc.id });
      });

      if(lGame.Status == 0){
        let idToRemove = "";

      for(let i in teamGameL){
        if(teamGameL[i].TeamPosition == game.LNextGame[1]){
          idToRemove = teamGameL[i].id;
        }
      }

      if(idToRemove != ""){
        //Ta bort matchen från det laget
        let removeRef = doc(db, "TeamGame", idToRemove);
        await deleteDoc(removeRef);
      }

        if(game.LNextGame[1] == 1){
          await updateDoc(lossRef, {
            Team1Name: loserName
          })
        }else if(game.LNextGame[1] == 2){
          await updateDoc(lossRef, {
            Team2Name: loserName
          })
        }
        

        let teamGameObj = {
          TeamID: loserId,
          GameID: lGame.id,
          TeamPosition: game.LNextGame[1],
        }

        await addDoc(teamGameRef, teamGameObj);
        // Kolla om det finns en bracket game på nästa match
        let gameID   = game.LNextGame[0];
        let teamPos  = game.LNextGame[1];
        let teamID   = loserId;
        let teamName = loserName;
        let bracketItemID = game.id;

        await advanceToBracketItem(gameID, teamPos, teamID, teamName);
        await updatePlayedBracketItem(bracketItemID, isPosOneWinner);
        }
    }
  }

  handleStandingsUpdate();
}

async function handleStandingsUpdate(){
  // If all games done, update standings
  const gamesCollectionRef = collection(db, "Games");
  // Get all games
  let allGames = [];
  let res = await getDocs(gamesCollectionRef);
  res.forEach((doc) => {
    allGames.push({...doc.data(), id: doc.id})
  });
  let allFinished = true;
  allGames.forEach((game) => {
    if(game.Status != 2){
      allFinished = false;
    }
  });

  if (allFinished){
    // Get all groupteams
    let groupTeams = [];
    const groupTeamsRef = collection(db, "GroupTeams");
    res = await getDocs(groupTeamsRef);
    res.forEach((doc) => {
      groupTeams.push({...doc.data(), id: doc.id})
    });
    
    let teamToPoints = {};

    processGroupResults(teamToPoints, groupTeams, points["Gr3"], points["Gr4-5"], points["Gr4-5"]);

    // get all groups
    let groups = [];
    const groupsRef = collection(db, "Groups");
    res = await getDocs(groupsRef);
    res.forEach((doc) => {
      groups.push({...doc.data(), id: doc.id})
    });

    // Get all quarterfinals
    let quarterfinals = [];
    for(let i in groups){
      quarterfinals.push(groups[i].NextGames[0]);
      quarterfinals.push(groups[i].NextGames[2]);
    }

    let semifinals = [];
    // Process quarterfinals
    processResults(teamToPoints, quarterfinals, allGames, -1, points["5-8"], semifinals, []);

    let final = [];
    let bronze = [];
    // Process semifinals
    // Get final and bronze ids
    processResults(teamToPoints, semifinals, allGames, -1, -1, final, bronze);

    // Process final
    processResults(teamToPoints, final, allGames, points["1"], points["2"], [], []);
    // Process bronze
    processResults(teamToPoints, bronze, allGames, points["3"], points["4"], [], []);

    console.log(teamToPoints);
    
    // Update standings
    await updateStandings(teamToPoints);
  }
}

async function updateHistory(teamToPoints){
  // Get top three teams with highest total points
  let standingsRef = collection(db, "Standings");
  let standings = [];
  let res = await getDocs(standingsRef);
  res.forEach((doc) => {
    standings.push({...doc.data(), id: doc.id})
  });
  standings.sort((a, b) => {
    return b.TotalPoints - a.TotalPoints;
  });
  let topThree = standings.slice(0, 3);

  let season = standings[0].Season;
  let teamNames = [];
  let placements = [];
  let plt = 1;
  let lastPoints = topThree[0].TotalPoints;
  let points = [];

  for (let i in topThree){
    teamNames.push(topThree[i].TeamName);
    points.push(topThree[i].TotalPoints);

    if(lastPoints == topThree[i].TotalPoints){
      placements.push(plt);
    }
    else{
      plt++;
      placements.push(plt);
      lastPoints = topThree[i].TotalPoints;
    }
  }

  let historyRef = collection(db, "History");
  let history = {
    Season: season,
    TeamName: teamNames,
    Placements: placements,
    Points: points,
  };

  // Check if season already exists
  const q = query(historyRef, where("Season", "==", season));
  const querySnapshot = await getDocs(q);
  let lst = [];
  querySnapshot.forEach((doc) => {
      lst.push({ ...doc.data(), id: doc.id });
  });
  if(lst.length > 0){
    // Update existing season
    const historyDocRef = doc(db, "History", lst[0].id);
    await updateDoc(historyDocRef, {
      TeamName: teamNames,
      Placements: placements,
      Points: points,
    });
  }
  else{
    // Create new season
    await addDoc(historyRef, history);
  }

}

function processGroupResults(result, groupTeams, pointsThirdPlace, pointsFourthPlace, pointsFifthPlace){
  for(let i in groupTeams){
    if(groupTeams[i].TeamData[6] == "3"){
      let teamName = (groupTeams[i].TeamData[0]);
      result[teamName] = pointsThirdPlace;
    }else if(groupTeams[i].TeamData[6] == "4"){
      let teamName = (groupTeams[i].TeamData[0]);
      result[teamName] = pointsFourthPlace; 
    }else if(groupTeams[i].TeamData[6] == "5"){
      let teamName = (groupTeams[i].TeamData[0]);
      result[teamName] = pointsFifthPlace;
    }
  }
}

function processResults(result, gameIDs, allGames, 
                        winnerPoints, loserPoints, winnerAdv, loserAdv)
{
  for(let i in gameIDs){
    for(let j in allGames){
      if(allGames[j].id == gameIDs[i]){
        let game = allGames[j];
        let team1Name = game.Team1Name;
        let team2Name = game.Team2Name;
        let team1Score = game.Team1Score;
        let team2Score = game.Team2Score;
        let winnerName = "";
        let loserName = "";

        if(team1Score > team2Score){
          winnerName = team1Name;
          loserName = team2Name;
        }else if(team1Score < team2Score){
          winnerName = team2Name;
          loserName = team1Name;
        }

        if(winnerPoints != -1){
          result[winnerName] = winnerPoints;
        }

        if(loserPoints != -1){
          result[loserName] = loserPoints;
        }

        if(game.WNextGame.length > 0){
          winnerAdv.push(game.WNextGame[0]);
        }
        if(game.LNextGame.length > 0){
          loserAdv.push(game.LNextGame[0]);
        }
      }
    }
  }
}

async function getMetadata(){
  // Get metadata
  const metadataRef = doc(db, "Metadata", "metadata");
  const metadataRes = await getDoc(metadataRef);
  let metadata = {...metadataRes.data(), id: metadataRes.id}

  let cursor = metadata.Cursor;
  
  if(cursor < 0 || cursor > 3){
    console.log("Invalid cursor");
    return false;
  }
  return cursor;
}

async function updateStandings(teamToPoints){
  const standingsRef = collection(db, "Standings");
  //Get all standings
  let standings = [];
  let res = await getDocs(standingsRef);
  res.forEach((doc) => {
    standings.push({...doc.data(), id: doc.id})
  });

  let cursor = await getMetadata();
  if(cursor === false){
    return;
  }

  for(let i in teamToPoints){
    let teamReported = false;
    let teamName = i.toLowerCase().trim();
    let teamPoints = teamToPoints[i];

    for(let j in standings){
      let existingTeamRecrod = standings[j];
      let existingTeamName = existingTeamRecrod.TeamName.toLowerCase().trim();
      
      if(existingTeamName == teamName){
        // Update record
        let points = existingTeamRecrod.Points;
        points[cursor] = teamPoints;
        let totalPoints = points.reduce((a, b) => a + b, 0);
        let standingsDocRef = doc(db, "Standings", existingTeamRecrod.id);

        await updateDoc(standingsDocRef, {
          Points: points,
          TotalPoints: totalPoints,
        })
        teamReported = true;
        break;
      }
    }
    if (!teamReported){
      // Create new record
      let points = [0, 0, 0, 0]
      points[cursor] = teamPoints;
      let totalPoints = points.reduce((a, b) => a + b, 0);

      let newRecord = {
        TeamName: i.trim(),
        Points: points,
        Season: standings[0].Season,
        TotalPoints: totalPoints,
      }
      await addDoc(standingsRef, newRecord);
    }
  }

  if(cursor == 3){
    // Update history
    await updateHistory(teamToPoints);
  }

  // Update seasonReported to true
  const metadataRef = doc(db, "Metadata", "metadata");
  await updateDoc(metadataRef, {
    CurrentStandingsReported: true,
  });

}

async function updatePlayedBracketItem(bracketItemID, isPosOneWinner){
  const bracketCollectionRef = collection(db, "Bracket");
  const q = query(bracketCollectionRef, where("id", "==", bracketItemID));
  const querySnapshot = await getDocs(q);
  let lst = [];

  querySnapshot.forEach((doc) => {
      lst.push({ ...doc.data(), id: doc.id });
  });


  if(lst.length > 0){
    const bracketDocRef = doc(db, "Bracket", lst[0].Identifier)
    if(isPosOneWinner){
      let participantsObject = {
        id: lst[0].participants[0].id,
        resultText: lst[0].participants[0].resultText,
        isWinner: true,
        status: 'Played',
        name: lst[0].participants[0].name,
      }

      await updateDoc(bracketDocRef, {
        state: 'Done',
        participants: [participantsObject, lst[0].participants[1]]
      })
    }else{
      let participantsObject = {
        id: lst[0].participants[1].id,
        resultText: lst[0].participants[1].resultText,
        isWinner: true,
        status: 'Played',
        name: lst[0].participants[1].name,
      }

      await updateDoc(bracketDocRef, {
        state: 'Done',
        participants: [lst[0].participants[0], participantsObject]
      })
    }
  }
}

async function advanceToBracketItem(gameID, teamPos, teamID, teamName){
  const bracketCollectionRef = collection(db, "Bracket");
  const q = query(bracketCollectionRef, where("id", "==", gameID));
  const querySnapshot = await getDocs(q);
  let lst = [];

  querySnapshot.forEach((doc) => {
      lst.push({ ...doc.data(), id: doc.id });
  });


  if(lst.length > 0){
    let participantsObject = {
      id: teamID,
      isWinner: false,
      name: teamName,
      resultText: lst[0].participants[teamPos-1].resultText,
      status: null
    }
    const bracketDocRef = doc(db, "Bracket", lst[0].Identifier)
    if(teamPos == 1){
      await updateDoc(bracketDocRef, {
        participants: [participantsObject, lst[0].participants[1]]
      })
    }

    if(teamPos == 2){
      await updateDoc(bracketDocRef, {
        participants: [lst[0].participants[0], participantsObject]
      })
    }
  }
}

async function advanceTeamsFromGroup(group, teamData, teamIDs){

  let teamGames = []
  let teamGameCollectionRef = collection(db, "TeamGame");
  let result = await getDocs(teamGameCollectionRef);
  result.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    teamGames.push({...doc.data(), id: doc.id})
  }); 
  for(let i = 0; i < group.NextGames.length/2; i++){
    
    //Kolla om matchen är ostartad
    let gameRef = doc(db, "Games", group.NextGames[i*2])
    let res = await getDoc(gameRef);
    let gameObj = {...res.data(), id: res.id}
    if(gameObj.Status != 1){
      //Lägg till namn i match
      let pos = group.NextGames[(i*2)+1];
      if(pos == 1){
        await updateDoc(gameRef, {
          Team1Name: teamData[i][0],
        })
      }else if(pos == 2){
        await updateDoc(gameRef, {
          Team2Name: teamData[i][0],
        })
      }
      //Kolla så det inte ligger någon skit i teamGames
        //Ta bort isåfall
      for(let j in teamGames){
        if(teamGames[j].GameID == gameObj.id && teamGames[j].TeamPosition == pos){
          let teamGameRef = doc(db, "TeamGame", teamGames[j].id)
          await deleteDoc(teamGameRef);
        }
      }
      
      //skapa teamgames
      let teamGameObj = {
        TeamID: teamIDs[i],
        GameID: gameObj.id,
        TeamPosition: pos,
      }

      let tgRef = collection(db, "TeamGame");
      await addDoc(tgRef, teamGameObj);
      await advanceToBracketItem(group.NextGames[i*2], pos, teamIDs[i], teamData[i][0]);
    }else{
      console.log("Game already started");
    }
  }
}

async function reCalculateGroup(game){
  //Ta fram gruppnamn från game.GameName
  let gamename = game.GameName.replace(/[0-9]/g, '');
  //Dra ner gruppen
  const q = query(collection(db, "Groups"), where("GroupName", "==", gamename));
  const querySnapshot = await getDocs(q);
  let groupObj = null;

  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    groupObj = {...doc.data(), id: doc.id}
  });
  //Dra ner alla matcher i gruppen
  let allGames = [];
  const gamesCollectionRef = collection(db, "Games");
  let res = await getDocs(gamesCollectionRef);
  res.forEach((doc) => {
    allGames.push({...doc.data(), id: doc.id})
  });

  let groupGames = [];
  allGames.forEach((game) => {
    if(groupObj.GameIDs.includes(game.id)){
      groupGames.push(game);
    }
  });

 
  let groupTeams = [];
  
  const groupTeamsRef = collection(db, "GroupTeams");
  res = await getDocs(groupTeamsRef);
  res.forEach((doc) => {
    if(doc.data().GroupID == groupObj.id){
      groupTeams.push({...doc.data(), id: doc.id})
    }
  });

  let teamIDs = [];
  let teamNames = [];
  for(let i in groupTeams){
    teamIDs.push(groupTeams[i].TeamID);
    teamNames.push(groupTeams[i].TeamData[0]);
  }

  //Gå igenom alla spelade matcher
  //Skapa två matriser, en för vinst/förlust (1/-1) och en för gjorda mål

  let nTeams = groupTeams.length
  let winMatrix = [];
  let goalMatrix = [];
  for(let i = 0; i < nTeams; i++){
    winMatrix.push(new Array(nTeams).fill(0));
    goalMatrix.push(new Array(nTeams).fill(0));
  }

  //Indexet som laget ligger på i Group.TeamIDs är indexet i matriserna
  //Skapa statistik
  let finishedGamesCount = 0; 
  groupGames.forEach((game) => {
    if(game.Status == 2){
      finishedGamesCount++;
      //Hitta team1index och team2index
      let team1index = teamNames.indexOf(game.Team1Name);
      let team2index = teamNames.indexOf(game.Team2Name);

      //Räkna ut vem som vann
      if(game.Team1Score > game.Team2Score){
        winMatrix[team1index][team2index] = 1;
        winMatrix[team2index][team1index] = -1;

        goalMatrix[team1index][team2index] = game.Team1Score;
        goalMatrix[team2index][team1index] = game.Team2Score;
      }else {
        winMatrix[team1index][team2index] = -1;
        winMatrix[team2index][team1index] = 1;

        goalMatrix[team1index][team2index] = game.Team1Score;
        goalMatrix[team2index][team1index] = game.Team2Score;
      }
      if(game.Team1Score == game.Team2Score){
        winMatrix[team1index][team2index] = 2;
        winMatrix[team2index][team1index] = 2;

        goalMatrix[team1index][team2index] = game.Team1Score;
        goalMatrix[team2index][team1index] = game.Team2Score;
      }
      };
    })
  let advanceGroup = false;
  
  if(finishedGamesCount == groupGames.length){
    advanceGroup = true;
  }
  //Skapa lista med statistik i ordning
  let stats = [];
  //Mappa namn till index

  for(let i = 0; i < nTeams; i++){
    let gamesPlayed = 0;
    let gamesWon = 0;
    let gamesLost = 0;
    let gd = 0;
    let points = 0;

    for(let j = 0; j < nTeams; j++){
      if(winMatrix[i][j] != 0){
        gamesPlayed += 1;
      }
      if(winMatrix[i][j] == 1){
        gamesWon += 1;
        points += 3;
      }
      if(winMatrix[i][j] == -1){
        gamesLost += 1;
      }
      if(winMatrix[i][j] == 2){
        points += 1;
      }
      gd += goalMatrix[i][j];
      gd -= goalMatrix[j][i];
    }
    stats.push(teamNames[i]);
    stats.push(gamesPlayed.toString());
    stats.push(gamesWon.toString());
    stats.push(gamesLost.toString());
    
    if(gd >= 0){
      stats.push("+".concat(gd.toString()))
    }else{
      stats.push(gd.toString());
    }
    stats.push(points.toString());
  }

  let indexToPoints = [[0, parseInt(stats[5])]];
  //Gå igenom poäng
  for(let i = 1; i < nTeams; i++){
    let points = parseInt(stats[(i*6)+5]);
    indexToPoints.push([i, points]);
  }
  indexToPoints.sort((a, b) => {return -1*(a[1]-b[1])})

  let subGroups = [];
  let subGroup = [indexToPoints[0][0]];
  let prev = indexToPoints[0][1];
  for(let i = 1; i < indexToPoints.length; i++){
    if(prev != indexToPoints[i][1]){
      subGroups.push(subGroup);
      subGroup = [indexToPoints[i][0]];
      prev = indexToPoints[i][1];
    }else{
      subGroup.push(indexToPoints[i][0]);
      prev = indexToPoints[i][1];
    }
  }
  subGroups.push(subGroup);

  //Kolla längden på subGroup i subGroups
  let finalTeamIndices = [];
  for(let i = 0; i < subGroups.length; i++){
    if(subGroups[i].length > 1){
      let listOfBrokenTies = breakTies(subGroups[i], winMatrix, goalMatrix);
      for(let j = 0; j < listOfBrokenTies.length; j++){
        finalTeamIndices.push(listOfBrokenTies[j]);
      }
    }else{
      finalTeamIndices.push(subGroups[i][0]);
    }
  }

  let newTeamData = [];
  for(let i = 0; i < finalTeamIndices.length; i++){
    let tmp = []
    for(let j = 0; j < 6; j++){
      tmp.push(stats[((finalTeamIndices[i]*6)+j)])
      if(j == 5){
        tmp.push((i+1).toString());
      }
    }
    newTeamData.push(tmp);
  }
  let newTeamIDs = [];
  for(let i = 0; i < newTeamData.length; i++){
    for(let j = 0; j < teamNames.length; j++){
      if(teamNames[j] == newTeamData[i][0]){
        newTeamIDs.push(teamIDs[j]);
        break;
      }
    }
  }
  //Hitta id på GroupTeams
  //Uppdatera GroupTeams
  for(let i in newTeamIDs){
    for(let j in groupTeams){
      if(newTeamIDs[i] == groupTeams[j].TeamID){
        let gtDocRef = doc(db, "GroupTeams", groupTeams[j].id)
        await updateDoc(gtDocRef, {TeamData: newTeamData[i]})
        break;
      }
    }
  }
  if(advanceGroup){
    advanceTeamsFromGroup(groupObj, newTeamData, newTeamIDs);
  }
}

function breakWon(indexList, winMatrix){
  let indexToWonGames = [];
  for(let i = 0; i < indexList.length; i++){
    let wg = 0;
    for(let j = 0; j < indexList.length; j++){
      if(winMatrix[indexList[i]][indexList[j]] == 1){
        wg += 1;
      }
    }
    indexToWonGames.push([indexList[i], wg]);
  }
  indexToWonGames.sort((a, b) => {return -1*(a[1] - b[1])});

  let subGroups = [];
  let subGroup = [indexToWonGames[0][0]];
  let prev = indexToWonGames[0][1];
  for(let i = 1; i < indexToWonGames.length; i++){
    if(prev != indexToWonGames[i][1]){
      subGroups.push(subGroup);
      subGroup = [indexToWonGames[i][0]];
      prev = indexToWonGames[i][1];
    }else{
      subGroup.push(indexToWonGames[i][0]);
      prev = indexToWonGames[i][1];
    }
  }
  subGroups.push(subGroup); 
  return subGroups;
}

function breakGS1(indexList, goalMatrix){
  let indexToGD = []
  for(let i = 0; i < indexList.length; i++){
    let gd = 0;
    for(let j = 0; j < indexList.length; j++){
      gd += (goalMatrix[indexList[i]][indexList[j]])
    }
    indexToGD.push([indexList[i], gd])
  }

  indexToGD.sort((a, b) => {return -1*(a[1] - b[1])}); 
  let subGroups = [];
  let subGroup = [indexToGD[0][0]];
  let prev = indexToGD[0][1];
  for(let i = 1; i < indexToGD.length; i++){
    if(prev != indexToGD[i][1]){
      subGroups.push(subGroup);
      subGroup = [indexToGD[i][0]];
      prev = indexToGD[i][1];
    }else{
      subGroup.push(indexToGD[i][0]);
      prev = indexToGD[i][1];
    }
  } 
  subGroups.push(subGroup);
  return subGroups;
}

function breakGS2(indexList, goalMatrix){
  let indexToGD = [];
  for(let i = 0; i < indexList.length; i++){
    let gd = 0;
    for(let j = 0; j < goalMatrix.length; j++){
      gd += (goalMatrix[indexList[i]][j])
    }
    indexToGD.push([indexList[i], gd])
  }

  
  indexToGD.sort((a, b) => {return -1*(a[1] - b[1])}); 
  let subGroups = [];
  let subGroup = [indexToGD[0][0]];
  let prev = indexToGD[0][1];
  for(let i = 1; i < indexToGD.length; i++){
    if(prev != indexToGD[i][1]){
      subGroups.push(subGroup);
      subGroup = [indexToGD[i][0]];
      prev = indexToGD[i][1];
    }else{
      subGroup.push(indexToGD[i][0]);
      prev = indexToGD[i][1];
    }
  } 
  subGroups.push(subGroup);
  return subGroups;
}

function breakGD2(indexList, goalMatrix){
  let indexToGD = [];
  for(let i = 0; i < indexList.length; i++){
    let gd = 0;
    for(let j = 0; j < goalMatrix.length; j++){
      gd += (goalMatrix[indexList[i]][j]-goalMatrix[j][indexList[i]])
    }
    indexToGD.push([indexList[i], gd])
  }

  
  indexToGD.sort((a, b) => {return -1*(a[1] - b[1])}); 
  let subGroups = [];
  let subGroup = [indexToGD[0][0]];
  let prev = indexToGD[0][1];
  for(let i = 1; i < indexToGD.length; i++){
    if(prev != indexToGD[i][1]){
      subGroups.push(subGroup);
      subGroup = [indexToGD[i][0]];
      prev = indexToGD[i][1];
    }else{
      subGroup.push(indexToGD[i][0]);
      prev = indexToGD[i][1];
    }
  } 
  subGroups.push(subGroup);
  return subGroups; 
}

function breakGD1(indexList, goalMatrix){
  let indexToGD = []
  for(let i = 0; i < indexList.length; i++){
    let gd = 0;
    for(let j = 0; j < indexList.length; j++){
      gd += (goalMatrix[indexList[i]][indexList[j]]-goalMatrix[indexList[j]][indexList[i]])
    }
    indexToGD.push([indexList[i], gd])
  }

  indexToGD.sort((a, b) => {return -1*(a[1] - b[1])}); 
  let subGroups = [];
  let subGroup = [indexToGD[0][0]];
  let prev = indexToGD[0][1];
  for(let i = 1; i < indexToGD.length; i++){
    if(prev != indexToGD[i][1]){
      subGroups.push(subGroup);
      subGroup = [indexToGD[i][0]];
      prev = indexToGD[i][1];
    }else{
      subGroup.push(indexToGD[i][0]);
      prev = indexToGD[i][1];
    }
  } 
  subGroups.push(subGroup);
  return subGroups;
}

function oneBreakIteration(indexList, matrix, breakFunction){
  // Vad händer om två subgrupper och den ena blir mindre men inte den andra? 
  // Första subgruppen ska börja om på första rankingkriteriet och andra subgruppen ska fortsätta på nästa
  // Tror båda börjar om nu -> Är det ett problem?
  let winBreak = [];
  for(let i = 0; i < indexList.length; i++){
    if(indexList[i].length > 1){
      let gdBroken = breakFunction(indexList[i], matrix);
      for(let j = 0; j < gdBroken.length; j++){
        winBreak.push(gdBroken[j]);
      }
    }else{
      winBreak.push(indexList[i]);
    }
  };
  return winBreak;
}
 
function breakTies(indexList, winMatrix, goalMatrix){
  let breakers = [breakWon, breakGD1, breakGD2, breakGS1, breakGS2];
  let matrixes = [winMatrix, goalMatrix, goalMatrix, goalMatrix, goalMatrix];
  let cursor = 0;
  let newIndicies = [];
  let oldIndexList = []
  oldIndexList.push(indexList)
  
  while(true){
    newIndicies = oneBreakIteration(oldIndexList, matrixes[cursor], breakers[cursor]);
    cursor++;

    // Break if all teams are broken
    if(checkAllBroken(newIndicies)){
      break;
    }

    // Break if cursor is at the end
    if(cursor == breakers.length){
      break;
    }

    // Reset cursor if length is longer than before
    if(newIndicies.length > oldIndexList.length){
      cursor = 0;
    }
    oldIndexList = newIndicies;
  }
 
  let finalTeamPlacement = [];
  for(let i = 0; i < newIndicies.length; i++){
    if(newIndicies[i].length > 1){
      for(let j = 0; j < newIndicies[i].length; j++){
        finalTeamPlacement.push(newIndicies[i][j])
      }
    }else{
       finalTeamPlacement.push(newIndicies[i][0])
     }
  }
  
  return finalTeamPlacement;
}
 

function checkAllBroken(indexList){
  for(let i = 0; i < indexList.length; i++){
    if(indexList[i].length > 1){
      return false;
    }
  }
  return true;
}

export async function finishGame(game, team1ID, team2ID){
  if(game.Type === 1){
    //TODO: LagID
    await advanceTeams(game, team1ID, team2ID);
  }else if(game.Type === 0){
    await reCalculateGroup(game);
  }
}

export function getTimeStringBracket(game){
  let dateTime = game.DateTime;
  let time = convertMinutesToDate(dateTime);
  let timeString = time[4] + "-" + time[3] + "-" + time[2] + " - " + time[0] + ":" + time[1];
  return timeString;
}