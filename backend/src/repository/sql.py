from typing import Callable, List, Optional

from sqlalchemy import Column, Float, Integer, String
from sqlalchemy.orm import Session, declarative_base

from src.repository.interface import (
    IProductRepository,
    TProductBaseModel,
    TProductModel,
)

Base = declarative_base()


class TProductORM(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String(500))
    quantity = Column(Integer, default=0)


class TSQLiteProductRepository(IProductRepository):
    def __init__(self, session_factory: Callable[[], Session]):
        self._session_factory = session_factory

    def create(self, product: TProductBaseModel) -> TProductModel:
        with self._session_factory() as session:
            db_product = TProductORM(**product.model_dump())
            session.add(db_product)
            session.commit()
            session.refresh(db_product)
            return TProductModel.model_validate(db_product)

    def get(self, product_id: int) -> Optional[TProductModel]:
        with self._session_factory() as session:
            db_product = session.get(TProductORM, product_id)
            return TProductModel.model_validate(db_product) if db_product else None

    def get_all(self) -> List[TProductModel]:
        with self._session_factory() as session:
            return list(map(TProductModel.model_validate, session.query(TProductORM).all()))

    def update(self, product_id: int, product: TProductBaseModel) -> Optional[TProductModel]:
        with self._session_factory() as session:
            db_product = session.get(TProductORM, product_id)
            if not db_product:
                return None

            for field, value in product.model_dump().items():
                setattr(db_product, field, value)

            session.commit()
            return TProductModel.model_validate(db_product)

    def delete(self, product_id: int) -> bool:
        with self._session_factory() as session:
            db_product = session.get(TProductORM, product_id)
            if not db_product:
                return False

            session.delete(db_product)
            session.commit()
            return True
