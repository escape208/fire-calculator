import configparser
import os
from dotenv import load_dotenv

config = configparser.ConfigParser()

CURRENT_WORKING_DIRECTORY = os.getcwd()

SENSITIVE_CONFIG_PATH = os.path.join(CURRENT_WORKING_DIRECTORY, '.env')


def load_config(path: str):
    print(f'Attempting to read config file from "{path}"')

    if os.path.exists(path) == False:
        print(
            f'Config file not found at "{path}". Existing environment variables will be used.')
    else:
        load_dotenv(path)
        print('Config file read successfully!')


class Settings():
    load_config(SENSITIVE_CONFIG_PATH)

    # Set in docker image during build.
    LOG_PATH = os.environ["NPID_LOG_FOLDER"]
    DB_USERNAME = os.environ["DB_USERNAME"]
    DB_PWD = os.environ["DB_PWD"]
    DB_HOSTNAME = os.environ["DB_HOSTNAME"]
    DB_NAME = os.environ["DB_NAME"]
    DB_PORT = os.environ["DB_PORT"]
    GENERATE_USERS_ENDPOINT = os.environ["GENERATE_USERS_ENDPOINT"]
    REFRESH_TOKEN_EXP_MINUTES = int(
        os.environ["REFRESH_TOKEN_EXP_MINUTES"])
    ACCESS_TOKEN_EXP_MINUTES = int(
        os.environ["ACCESS_TOKEN_EXP_MINUTES"])
    SSH_PUBLIC_KEY_PATH = os.environ["SSH_PUBLIC_KEY_PATH"]
    SSH_PRIVATE_KEY_PATH = os.environ["SSH_PRIVATE_KEY_PATH"]


settings = Settings()