from typing import List

from fastapi import APIRouter, FastAPI

from src.handlers import TProductHandlers
from src.repository import TProductModel


class TApp(FastAPI):
    def __init__(self, handlers: TProductHandlers):
        super().__init__()
        self._setup_product_routes(handlers)

    def _setup_product_routes(self, handlers: TProductHandlers):
        product_router = APIRouter()
        product_router.add_api_route(
            path="/create_product", endpoint=handlers.create_product, methods=["POST"], response_model=TProductModel
        )
        product_router.add_api_route(
            path="/get_product/{product_id}",
            endpoint=handlers.get_product,
            methods=["GET"],
            response_model=TProductModel,
        )
        product_router.add_api_route(
            path="/get_all_products",
            endpoint=handlers.get_all_products,
            methods=["GET"],
            response_model=List[TProductModel],
        )
        product_router.add_api_route(
            path="/update_product/{product_id}",
            endpoint=handlers.update_product,
            methods=["PUT"],
            response_model=TProductModel,
        )
        product_router.add_api_route(
            path="/delete_product/{product_id}", endpoint=handlers.delete_product, methods=["DELETE"]
        )

        self.include_router(product_router)
