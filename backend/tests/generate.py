import random

from faker import Faker
from sqlalchemy import Column, Float, Integer, String, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Настройка базы данных
Base = declarative_base()
engine = create_engine("sqlite:///shop.db")
Session = sessionmaker(bind=engine)


# 2. Определяем модель (аналогичную DBProduct)
class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String(500))
    quantity = Column(Integer, default=0)


# 3. Создаем таблицы
Base.metadata.create_all(engine)

# 4. Генератор тестовых данных
fake = Faker()


def generate_products(count: int = 20):
    products = []
    categories = ["Ноутбук", "Смартфон", "Наушники", "Монитор", "Клавиатура", "Мышь"]

    for _ in range(count):
        category = random.choice(categories)
        products.append(
            {
                "name": f"{category} {fake.word().capitalize()}",
                "price": round(random.uniform(100, 2000), 2),
                "description": fake.sentence(),
                "quantity": random.randint(1, 100),
            }
        )

    return products


# 5. Заполняем базу данных
def seed_database():
    session = Session()

    try:
        # Очистка таблицы (если нужно)
        session.query(Product).delete()

        # Добавляем тестовые товары
        for product_data in generate_products():
            product = Product(**product_data)
            session.add(product)

        session.commit()
        print(f"✅ Добавлено {session.query(Product).count()} товаров")
    except Exception as e:
        session.rollback()
        print(f"❌ Ошибка: {e}")
    finally:
        session.close()


if __name__ == "__main__":
    seed_database()
