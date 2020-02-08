from Command import Command, InvalidDiscordUser, InvalidMooxterUser
from DiscordClient import DiscordClient

def Send(client, user, destination, amount):
    dstUser = VerifyUser(client, destination)
    try:
        amount = float(amount)
    except ValueError as e:
        return (True, 'The amount needs to be specified as a number.')
    #Send
    if(True):
        return (True, 'Successfully sent %s to %s.' % (amount, dstUser.name))
    else:
        return (True, 'Failed to send %s to %s.' % (amount, dstUser.name))
    

def GetBalance(client, user):
    return

def GetHistory(client, user):
    return

def Help(client, user):
    return

def ProvideLink(client, user):
    return

def VerifyUser(client, user):
    if(type(user) == str):
        userString = user
        user = client.getUserFromMention(user)
        if(user is None):
            raise InvalidDiscordUser(userString)
    #If user snowflake in database confirm
    return user





#List of commands
#Format is {COMMAND KEYWORD: (function, parameter amount)}
COMMANDS = {
    'SEND': Command('SEND', Send, 2),
    'GETBALANCE': Command('GETBALANCE', GetBalance, 0),
    'GETHISTORY': Command('GETHISTORY', GetHistory, 0),
    'HELP': Command('HELP', Help, 0)
}
