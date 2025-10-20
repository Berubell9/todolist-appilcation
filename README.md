### คำเตือน
> เวลาเเก้ให้ไปดูที่ .env เเละ manifest/kustomization.yaml ก่อนเสมอ

# อธิบายเเต่ละโฟลเดอร์
- .github = workflow ของ github action
- application = file สำหรับ set up Argo CD
- manifest = manifest file สำหรับสร้าง objects ใน kubernetes
- my-app = frontend code (next.js + tailwind)
- api = backend code (node.js + express.js)
- sql = schema mysql database

# Quick Start

### เข้าโปรเจค

```base
cd todolist-appilcation
```

## เปิด MySQL (Container)

1. Run MySQL Container (เปลี่ยนรหัสเป็นของตัวเองก็ได้)
    ```base
    docker run -d --name mysql-db \
        -e MYSQL_ROOT_PASSWORD=rootStrong123 \
        -e MYSQL_DATABASE=appdb \
        -e MYSQL_USER=appuser \
        -e MYSQL_PASSWORD=appPass123 \
        -p 3306:3306 \
        -v mysql_data:/var/lib/mysql \
        mysql:8.4
    ```

2. “สคริปต์แบบอัตโนมัติ” ที่ใช้ให้ Docker รันคำสั่ง SQL ภายใน MySQL container ได้โดยไม่ต้องเข้า shell 
    ```base
    docker exec -i mysql-db mysql -uroot -prootStrong123 <<'SQL'
    CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'appPass123';
    GRANT ALL PRIVILEGES ON todo_app.* TO 'appuser'@'%';
    FLUSH PRIVILEGES;
    SQL
    ```

3. รัน Schema ที่เตรียมไว้ให้เข้าไปสร้างใน Container
    ```base
    docker exec -i mysql-db mysql -uroot -prootStrong123 < sql/schema.sql
    ```

4. เช็คว่ามีตาราง Schema เข้ามาไหม
    ```base
    docker exec -it mysql-db mysql -uappuser -pappPass123 -e "SELECT COUNT(*) rows_in_tasks FROM todo_app.tasks;"
    ```

5. วิธีเข้าไปใน MySQL Container
    ```base
    docker exec -it mysql-db mysql -uappuser -pappPass123 appdb
    ```
    หรือ
    ```base
    docker exec -it mysql-db mysql -uroot -prootStrong123
    ```


## เปิด Backend หรือ API
```py
cd api

# ติดตั้ง package กรณีติดตั้ง Web ครั้งแรก
npm i

node index.js
```

เช็คว่าสามารถเข้าถึง API ที่สร้างได้ไหม => **ถ้าได้เข้าถึงได้ Status จะขึ้น 200**
```base
curl -v http://localhost:5000/tasks
```

## เปิด Frontend
```py
cd my-app

# ติดตั้ง package กรณีติดตั้ง Web ครั้งแรก
npm i

npm run dev
```

# วิธีเปิดเเบบ docker-compose.yml

1. เข้าโปรเจค

    ```base
    cd todolist-appilcation
    ```

2. Run Docker Compose File

    ```base
    docker compose up -d
    ```
    ควรเห็น : Container ชื่อ 
    - todolist-appilcation-web-1
    - todolist-appilcation-api-1
    - todolist-appilcation-mysql-1

3. เช็คก่อนใช้งาน
    
    - เช็คว่า MySQL is Alive ไหม
        ```base
        docker exec todolist-appilcation-mysql-1 sh -c 'until mysqladmin ping -h 127.0.0.1 -uroot -prootStrong123 --silent; do sleep 1; done'
        ```
         ควรเห็น : mysql is alive

    - เช็ค env ใน Container ของ Frontend
        ```base
        docker exec -it todolist-appilcation-web-1 sh -lc 'printenv | grep API_BASE_URL'
        ```
        ควรเห็น : API_BASE_URL=http://api:5000

4. รัน Schema ที่เตรียมไว้
    ```base
    docker exec -i todolist-appilcation-mysql-1 mysql -uroot -prootStrong123 < ./sql/schema.sql
    ```

5. เช็คว่ามีตาราง Schema เข้ามาไหม
    ```base
    docker exec -it todolist-appilcation-mysql-1 mysql -uroot -prootStrong123 -e "SHOW TABLES IN todo_app;"
    ```

6. ทดสอบ API
    ```base
    docker exec -it todolist-appilcation-web-1 sh -lc 'apk add -q curl || :; curl -sv http://api:5000/tasks | head'
    ```
    ควรเห็น : 200 ok

7. Down Docker Compose File
    ```base
    docker compose down
    ```

8. ถ้ามีการอัพเดต docker-compose.yml ให้ลบ Container เเละ docker compose up -d ขึ้นมาใหม่