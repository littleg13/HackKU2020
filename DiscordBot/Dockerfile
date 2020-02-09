FROM python:3.7

COPY requirements.txt /
COPY Command.py Commands.py DiscordBot.py DiscordClient.py /

run apt install default-libmysqlclient-dev
run pip3 install -r requirements.txt

CMD ["python3", "./DiscordBot.py"]