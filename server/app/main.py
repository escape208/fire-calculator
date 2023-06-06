from .classes.settings import settings

from .classes.DatabaseConnection import engine
from .models import CategoryModels
from .routers import npids_route
import datetime
import logging
from logging import handlers
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

DATE_TAG = datetime.datetime.now().strftime("%Y-%b-%d")
LOG_FILENAME = f'{settings.LOG_PATH}/npidapi-{DATE_TAG}.log'

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter(
    '%(asctime)s|[%(levelname)s]|%(thread)d|%(filename)s|%(funcName)s|LINE: %(lineno)d - %(message)s')

fileHandler = handlers.RotatingFileHandler(
    filename=LOG_FILENAME, maxBytes=10000000, backupCount=2)

fileHandler.setFormatter(formatter)

streamHandler = logging.StreamHandler()
streamHandler.setFormatter(formatter)

logger.addHandler(fileHandler)
logger.addHandler(streamHandler)

CategoryModels.Base.metadata.create_all(bind=engine)

app = FastAPI()

# origins = ["*"]

origins = [
    "http://localhost",
    "https://localhost",
    "http://0.0.0.0:3000",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(npids_route.router)

@app.get("/")
def root():
    return {"Status": "OK"}
