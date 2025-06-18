from typing import Callable

import punq
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from src.app import TApp
from src.handlers import TProductHandlers
from src.repository import IProductRepository, TSQLiteProductRepository


def get_session_factory() -> Callable[[], Session]:
    engine = create_engine("sqlite:///shop.db")
    return sessionmaker(bind=engine, expire_on_commit=False)


def get_container() -> punq.Container:
    container = punq.Container()

    container.register(Callable[[], Session], get_session_factory)
    container.register(IProductRepository, TSQLiteProductRepository)
    container.register(TProductHandlers, TProductHandlers)
    container.register(TApp, TApp)

    return container
