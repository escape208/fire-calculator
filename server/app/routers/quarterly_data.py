from fastapi import status, HTTPException, Depends, APIRouter
from ..schemas.QuarterlySchema import QuarterlyDataCreate, QuarterlyDataOut
from ..models.QuarterlyData import QuarterlyData
from ..classes.DatabaseConnection import get_db
from ..classes.settings import settings
from sqlalchemy.orm import Session
from .stock_route import get_stock_by_symbol_common
from typing import List
import logging
import requests

router = APIRouter(
    prefix="/quarterlydata",
    tags=['Quarterly Data']
)


@router.get("/", response_model=List[QuarterlyDataOut])
async def get_all_quarterly_data(search: str = "", db: Session = Depends(get_db)):
    logging.debug('called')

    return db.query(QuarterlyData).all()


@router.get("/{symbol}", response_model=QuarterlyDataOut)
async def get_quarterly_data_by_symbol(symbol: str, db: Session = Depends(get_db)):
    logging.debug('called')
    return get_stock_by_symbol_common(symbol=symbol, db=db)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=QuarterlyDataOut)
async def add_quarterly_data(data: QuarterlyDataCreate, db: Session = Depends(get_db)):
    logging.debug('called')

    entry_exists = get_stock_by_symbol_common(symbol=data.symbol, db=db)

    if not entry_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Symbol {data.symbol} was not found')

    new_entry = QuarterlyData(**dict(data))

    new_entry.symbol = new_entry.symbol

    db.add(new_entry)
    db.commit()

    return new_entry


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_stock(id: int, db: Session = Depends(get_db)):
    logging.debug('called')

    del_query = db.query(QuarterlyData).filter(
        QuarterlyData.id == id)

    if del_query.first() == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"ID {id} was not found")

    del_query.delete(synchronize_session=False)

    db.commit()

    return
