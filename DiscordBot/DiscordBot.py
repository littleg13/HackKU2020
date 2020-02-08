import discord
from Commands import COMMANDS

token = ''
PREFIX = '!dd'


client = discord.Client()

@client.event
async def on_ready():
    print('%s has connected to the server.' % client.user)

@client.event
async def on_message(message):
    content = message.content.split()
    if(content[0] != PREFIX):
        return
    if(content[1].upper() not in COMMANDS):
        await message.channel.send('Unknown command. Please use !dd help for a list of commands.')
        return
    try:
        COMMANDS[content[1].upper()].execute(message.author, *content[2:])
    except Exception as e:
        await message.channel.send(str(e))


class InvalidArgumentCount(Exception):
    """Base class for InvalidArgumentCount."""

    def __init__(self, message, correctNum):
        self.message = message
        self.correctNum = correctNum
        super(InvalidArgumentCount, self).__init__(self, message)

    def __str__(self):
        return 'Invalid number of arguments for command %s. Expected %d arguments.' % (self.message, self.correctNum)

class Command():
    def __init__(self, name, callback, addArguments):
        self.name = name
        self.callback = callback
        self.arguments = addArguments
        self.format = ''

    def getFormat(self):
        return self.format
    
    def execute(self, *args):
        if(len(args) != self.arguments + 1): # We use + 1 because the user is included in the arguments
            raise InvalidArgumentCount(self.name, self.arguments)
        self.callback(*args)

client.run(token)