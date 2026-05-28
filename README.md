# mishik
Вебзастосунок для притулків та майбутніх власників, що дозволяє зручно розміщувати та знаходити інформацію про тваринок, що шукають дім, або іншим способом допомогти їм. Отримати інформацію про деталі догляду за домашніми улюбленцями.

Як запускати:

frontend
cd fronetnd
npm install
npm run dev

backend
./mvnw spring-boot:run

db
один раз: docker run --name mishik-mysql -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=mishik -p 3307:3306 -d mysql:8
docker start mishik-mysql

Команди щоб зайти в бд і щось подивитися:
docker exec -it mishik-mysql mysql -u root -p
use mishik;
show tables; 
і тд

Потім зробим щоб все запускалося командою docker compose up


