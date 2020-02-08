

def Send(user, destination, amount):
    return

def GetBalance(user):
    return

def GetHistory(user):
    return

def Help(user):
    return

def ProvideLink(user):
    return

def VerifyUser(user):
    #If user snowflake in database confirm
    return


#List of commands
#Format is {COMMAND KEYWORD: (function, parameter amount)}
COMMANDS = {
    'SEND': Command('SEND', Send, 2),
    'GETBALANCE': Command('GETBALANCE', GetBalance, 0),
    'GETHISTORY': Command('GETHISTORY', GetHistory, 0),
    'HELP': Command('HELP', Help, 0)
}