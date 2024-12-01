import firebase_admin
import os
from firebase_admin import credentials, firestore

class DbHandler:
    def __init__(self, isEmulator, pathToServiceKey):
        self.collections    = ['Games', 'Teams', 'Groups', 'GroupTeams', 'TeamGame', 'Bracket']
        self.isEmulator     = isEmulator
        self.db             = None
        self.serviceKeyPath = pathToServiceKey

    def connect(self):
        if self.isEmulator:
            os.environ['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080'
        
        return self.connectDatabase()

    def connectDatabase(self):
        cred = credentials.Certificate(self.serviceKeyPath)
        firebase_admin.initialize_app(cred)
        self.db = firestore.client()

        return True
    
    def disconnect(self):
        self.db.close()
        self.db = None

        return None
    
    def deleteCollection(self, collRef):
        docs = collRef.list_documents()
        deleted = 0

        for doc in docs:
            doc.delete()
            deleted = deleted + 1

    def clearDb(self):
        for i in self.collections:
            ref = self.db.collection(i)
            self.deleteCollection(ref)
    
    def uploadItemToDb(self, item, collectionName):
        docRef = self.db.collection(collectionName).document(item['Identifier'])
        docRef.set(item)
        
        return docRef
    
    def uploadTeam(self, team):
        return self.uploadItemToDb(team, 'Teams')
         
    def uploadGame(self, game):
        return self.uploadItemToDb(game, 'Games')
    
    def uploadGroup(self, group):
        return self.uploadItemToDb(group, 'Groups')
    
    def uploadGroupTeam(self, groupTeam):
        return self.uploadItemToDb(groupTeam, 'GroupTeams')
    
    def uploadTeamGame(self, teamGame):
        return self.uploadItemToDb(teamGame, 'TeamGame')
    
    def uploadBracket(self, bracket):
        return self.uploadItemToDb(bracket, 'Bracket')
    
    def downloadGameFromDb(self, gameName):
        docs = self.db.collection("Games").where("GameName", '==', gameName).stream()
        games = []
        for doc in docs:
            gameObj = doc.to_dict()
            gameObj['Identifier'] = doc.id
            games.append(gameObj)
        
        if len(games) > 1:
            print("Multiple bracket games with identical names! Aborting")
            raise ValueError
        
        if len(games) == 0:
            print("Can't find bracket game! Aborting")
            raise ValueError
        
        return games
