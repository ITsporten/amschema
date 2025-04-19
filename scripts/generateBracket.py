import firebase_admin
import uuid
from firebase_admin import credentials, firestore
from datetime import datetime, timezone, timedelta
from dbHandler import DbHandler


class BracketGenerator:
    def __init__(self, pathToServiceKey):
        self.dbHandler          = DbHandler(False, pathToServiceKey)
        self.bracketItems       = []
        self.bracketGameObjects = []
        self.listOfQuarterGames = ['KVART1', 'KVART2', 'KVART3', 'KVART4']
        self.listOfSemiGames    = ['SEMI1', 'SEMI2']
        self.listOfFinalGames   = ['FINAL', 'BRONS']

    def connect(self):
        self.dbHandler.connect()

    def getBracketGameObjects(self):
        for qfGame in self.listOfQuarterGames:
            gameObjects = self.dbHandler.downloadGameFromDb(qfGame)
            for gameObj in gameObjects:
                self.bracketGameObjects.append(gameObj)

        for sfGame in self.listOfSemiGames:
            gameObjects = self.dbHandler.downloadGameFromDb(sfGame)
            for gameObj in gameObjects:
                self.bracketGameObjects.append(gameObj)

        for finalGame in self.listOfFinalGames:
            gameObjects = self.dbHandler.downloadGameFromDb(finalGame)
            for gameObj in gameObjects:
                self.bracketGameObjects.append(gameObj)

    def _getStartTime(self, gameObject):
        dateTime = gameObject['DateTime']
        "yyyy-mm-dd - hh:mm"
        minute = str(dateTime.minute)
        if minute == "0":
            minute = "00"

        return str(dateTime.year) + "-" + str(dateTime.month) + "-" + str(dateTime.day) + " - " + str(dateTime.hour) + ":" + minute

    def _getParticipants(self, gameObject):
        team1ID = str(uuid.uuid4())
        team2ID = str(uuid.uuid4())

        team1Object = {
                "id": team1ID, #// Unique identifier of any kind
                "resultText": "0", #// Any string works
                "isWinner": False,
                "status": None, #// 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
                "name": gameObject['Team1Name']
        }

        team2Object = {
                "id": team2ID, #// Unique identifier of any kind
                "resultText": "0", #// Any string works
                "isWinner": False,
                "status": None, #// 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
                "name": gameObject['Team2Name']
        }
        return [team1Object, team2Object]

    def createBracketItem(self, gameObject, tournamentRoundText):
            participants      = self._getParticipants(gameObject)
            startTime         = self._getStartTime(gameObject)
            nextMatchID       = gameObject['WNextGame'][0] if len(gameObject['WNextGame']) > 0 else None
            nextLooserMatchID = gameObject['LNextGame'][0] if len(gameObject['LNextGame']) > 0 else None
            isThirdPlaceMatch = True if gameObject['GameName'] == 'BRONS' else False

            bracketObject = {
                'Identifier': str(uuid.uuid4()),
                'nextLooserMatchId': nextLooserMatchID,
                'id': gameObject['Identifier'],
                'isThirdPlaceMatch': isThirdPlaceMatch,
                'name': gameObject['GameName'],
                'nextMatchId': nextMatchID,
                'tournamentRoundText': tournamentRoundText,
                'startTime': startTime,
                'state': None,
                'participants': participants
            }
            return bracketObject
    
    def _translateNameToRoundText(self, gameObj):
        tournamentRoundText = ""
        if gameObj['GameName'] in self.listOfQuarterGames:
            tournamentRoundText = "KVARTSFINALER"
        elif gameObj['GameName'] in self.listOfSemiGames:
            tournamentRoundText = "SEMIFINALER"
        elif gameObj['GameName'] in self.listOfFinalGames:
            tournamentRoundText = "FINALER"
        
        return tournamentRoundText

    def generateBracket(self):
        self.getBracketGameObjects()

        for gameObj in self.bracketGameObjects:
            tournamentRoundText = self._translateNameToRoundText(gameObj)
            bracketItem = self.createBracketItem(gameObj, tournamentRoundText)
            self.bracketItems.append(bracketItem)

        for bracketItem in self.bracketItems:
            self.dbHandler.uploadBracket(bracketItem)
