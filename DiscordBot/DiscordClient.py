from discord import Client

class DiscordClient(Client):
    def __init__(self):
        super().__init__()

    def getUserFromMention(self, mention):
        if(mention[0:2] == '<@' and mention[-1] == '>'):
            mention = mention[2:-1]
            if(mention[0] == '!'):
                return self.get_user(int(mention[1:]))
