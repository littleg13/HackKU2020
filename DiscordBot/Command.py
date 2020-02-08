class InvalidArgumentCount(Exception):
    """Base class for InvalidArgumentCount."""

    def __init__(self, message, correctNum):
        self.message = message
        self.correctNum = correctNum
        super(InvalidArgumentCount, self).__init__(self, message)

    def __str__(self):
        return 'Invalid number of arguments for command %s. Expected %d arguments.' % (self.message, self.correctNum)

class InvalidDiscordUser(Exception):
    """Base class for InvalidDiscordUser."""

    def __init__(self, user):
        self.user = user
        super(InvalidDiscordUser, self).__init__(self, user)

    def __str__(self):
        return 'User %s is not a valid discord user in this server.' % self.user

class InvalidMooxterUser(Exception):
    """Base class for InvalidMooxterUser."""

    def __init__(self, user):
        self.user = user
        super(InvalidMooxterUser, self).__init__(self, user)

    def __str__(self):
        return 'User %s does not have a Mooxster account linked to their discord account. Visit wwww.Mooxter.com to link your discord account.' % self.user

class Command():
    def __init__(self, name, callback, addArguments):
        self.name = name
        self.callback = callback
        self.arguments = addArguments
        self.format = ''

    def getFormat(self):
        return self.format
    
    def execute(self, *args):
        if(len(args) != self.arguments + 2): # We use + 2 because the user and client are included in the arguments
            raise InvalidArgumentCount(self.name, self.arguments)
        return self.callback(*args)