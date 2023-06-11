from fastapi import status, HTTPException, Depends, APIRouter
from ..schemas.StockSchema import StockCreate, StockOut
from ..models.Stock import Stock
from ..classes.DatabaseConnection import get_db
from ..classes.settings import settings
from sqlalchemy.orm import Session
from typing import List
import logging
import requests

router = APIRouter(
    prefix="/stock",
    tags=['Stock']
)


@router.get("/", response_model=List[StockOut])
async def get_all_stock(search: str = "", db: Session = Depends(get_db)):
    logging.debug('called')

    return db.query(Stock).all()


@router.get("/{symbol}", response_model=StockOut)
async def get_stock_by_symbol(symbol: str, db: Session = Depends(get_db)):
    logging.debug('called')
    return get_stock_by_symbol_common(symbol=symbol, db=db)


def get_stock_by_symbol_common(symbol: str, db: Session = Depends(get_db)):
    logging.debug('called')
    return db.query(Stock).filter(Stock.symbol == symbol).one_or_none()


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=StockOut)
async def add_stock(data: StockCreate, db: Session = Depends(get_db)):
    logging.debug('called')

    entry_exists = get_stock_by_symbol_common(symbol=data.symbol, db=db)

    if entry_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f'Symbol {data.symbol} already exists')

    new_entry = Stock(**dict(data))

    response = requests.get(
        f"{settings.ALPHA_VANTAGE_URL} + 'query?function=OVERVIEW&symbol={data.symbol}&apikey={settings.ALPHA_VANTAGE_KEY}'")

    response_data = response.json()

    new_entry.symbol = str(new_entry.symbol).upper()
    new_entry.name = response_data["Name"]
    new_entry.description = response_data["Description"]
    new_entry.sector = response_data["Sector"]

    response = requests.get(
        f"{settings.ALPHA_VANTAGE_URL} + 'query?function=GLOBAL_QUOTE&symbol={data.symbol}&apikey={settings.ALPHA_VANTAGE_KEY}'")

    response_data = response.json()

    new_entry.last_price = response_data["Global Quote"]["05. price"]
    new_entry.last_price_retrieved = response_data["Global Quote"]["07. latest trading day"]

    db.add(new_entry)
    db.commit()

    return new_entry


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_stock(id: int, db: Session = Depends(get_db)):
    logging.debug('called')

    del_query = db.query(Stock).filter(
        Stock.id == id)

    if del_query.first() == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"ID {id} was not found")

    del_query.delete(synchronize_session=False)

    db.commit()

    return
