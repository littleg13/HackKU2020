from Command import Command, InvalidDiscordUser, InvalidMooxterUser
from DiscordClient import DiscordClient
import requests
import mysql.connector
import json 
API = 'http://xpringapi:5000'




class InternalServerError(Exception):
    """Base class for InternalServerError."""

    def __init__(self, message):
        self.message = message
        super(InternalServerError, self).__init__(self, message)

    def __str__(self):
        return 'Internal Server Error: %s' % self.message


def Send(client, user, destination, amount):
    dstUser = VerifyUser(client, destination)
    try:
        amount = float(amount)
    except ValueError as e:
        return (True, 'The amount needs to be specified as a number.')
    sUID = getUID(user)
    dUID = getUID(dstUser)
    testData = {'sUID': sUID, 'dUID': dUID, 'amount': str(amount)}
    response = requests.post(API + '/api/v1/send', data=json.dumps(testData))
    if(response.status_code == 200):
        return (True, 'Successfully sent %d to %s.' % (amount, dstUser.name))
    elif(response.status_code == 400):
        return (True, 'Failed to send %s to %s. Request not properly formatted' % (amount, dstUser.name))
    else:
        raise InternalServerError(response.text)
    return (False, None)
    

def GetBalance(client, user):
    UID = getUID(user)
    response = requests.get(API + '/api/v1/balance/' + UID)
    data =  json.loads(response.text)
    return (True, str(data))
    if(response.status_code == 200):
        if('balance' in data):
            return (True, 'Balance: 0')
        return (True, 'Balance: %s' % (data['balance']))
    elif(response.status_code == 400):
        return (True, 'Failed to get balance. Request not properly formatted')
    else:
        raise InternalServerError(response.text)
    return (False, None)

def GetHistory(client, user):
    UID = getUID(user)
    response = requests.get(API + '/api/v1/transactionHistory/' + UID)
    data = json.loads(response.text)
    toPrint = "'''Transaction History:\n"
    if(response.status_code == 200):
        if(data['success'] == 'false'):
            toPrint += 'No Entries.\n'
        else:
            count = 1
            toPrint += '#   FROM    TO    AMOUNT    HASH\n'
            for entry in data['result'][-5:]:
                toPrint += '%d: %s  %s  %s  %s\n' % (count, entry['fromID'], entry['toID'], entry['amount'], entry['hash'])
                count += 1
        toPrint += "'''"
        return (True, toPrint)
    elif(response.status_code == 400):
        return (True, 'Failed to get transaction history. Request not properly formatted')
    else:
        raise InternalServerError(response.text)
    return (False, None)

def Help(client, user):
    toReturn = ''
    for command in COMMANDS:
        toReturn += command + ' - ' + COMMANDS[command].getFormat() + '\n'
    return (True, toReturn)

def ProvideLink(client, user):
    return (True, 'Visit wwww.Mooxter.com to link your discord account.')

def VerifyUser(client, user):
    if(type(user) == str):
        userString = user
        user = client.getUserFromMention(user)
        if(user is None):
            raise InvalidDiscordUser(userString)
        getUID(user)
    return user

def getUID(user):
    database = mysql.connector.connect(
        host="mysql",
        user="root",
        passwd="password",
        database="mooxter"
    )
    cursor = database.cursor()
    query = "SELECT uid FROM users WHERE discord_uid=%s" % user.id
    cursor.execute(query)
    result = cursor.fetchall()
    database.close()
    if(len(result) != 1):
        raise InvalidMooxterUser(user.name)
    return result[0][0]


#List of commands
#Format is {COMMAND KEYWORD: (function, parameter amount)}
COMMANDS = {
    'SEND': Command('SEND', Send, 2),
    'GETBALANCE': Command('GETBALANCE', GetBalance, 0),
    'GETHISTORY': Command('GETHISTORY', GetHistory, 0),
    'HELP': Command('HELP', Help, 0)
}
