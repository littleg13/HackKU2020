from DiscordClient import DiscordClient
from Commands import COMMANDS

token = ''
PREFIX = '!dd'


client = DiscordClient()

@client.event
async def on_ready():
    print('%s has connected to the server.' % client.user)

@client.event
async def on_message(message):
    content = message.content.split()
    if(not len(content)):
        return
    if(content[0] != PREFIX):
        return
    if(content[1].upper() not in COMMANDS):
        await message.channel.send('Unknown command. Please use !dd help for a list of commands.')
        return
    try:
        result = COMMANDS[content[1].upper()].execute(client, message.author, *content[2:])
        if(result[0]):
            await message.channel.send(result[1])
    except Exception as e:
        await message.channel.send(str(e))


client.run(token)