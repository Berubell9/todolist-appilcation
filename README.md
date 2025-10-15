# Quick Start

### เข้าโปรเจค

```base
cd todolist-appilcation
```

## เปิด MySQL (Container)

1. Run MySQL Container
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

2. “สคริปต์แบบอัตโนมัติ” ที่ใช้ให้ Docker รันคำสั่ง SQL ภายใน MySQL container โดยไม่ต้องเข้า shell 
    ```base
    docker exec -i mysql-db mysql -uroot -prootStrong123 <<'SQL'
    CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'appPass123';
    GRANT ALL PRIVILEGES ON todo_app.* TO 'appuser'@'%';
    FLUSH PRIVILEGES;
    SQL
    ```

3. รัน Schema ที่เตรียมไว้
    ```base
    docker exec -i mysql-db mysql -uroot -prootStrong123 < sql/schema.sql
    ```

4. เช็คว่ามี Schema เเละข้อมูลเข้ามาไหม
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

# กรณีถูกเเจ้งว่า Port ชนกัน
### Port ที่ Set ไว้เเบบปกติ
- Frontend (Next.js) => **Port : 3000**
- Backend (Node.js + Express.js) => **Port : 5000**
- Database (MySQL) => **Port : 3306**

### วิธีเเก้ไข
ดู Process ที่กำลังทำงานอยู่ทั้งหมด
```base
ps aux 
```
ดู Port ที่กำลังทำงานอยู่ทั้งหมด
```base
netstat -tulpn 
```
---

1. **ปัญหาที่ Port 3000** : เช็คว่า Process ของ Frontend Port 3000 ทำงานอยู่ไหม?
    ```base
    ps aux | grep next
    ```
    หากมีการทำงานอยู่ให้ kill ทิ้งเเล้วลองรัน Frontend ใหม่
    ```base
    kill -9 <Process ID>
    ```

2. **ปัญหาที่ Port 5000** : เช็คว่า Process ของ Backend Port 5000 ทำงานอยู่ไหม?
    ```base
    lsof -i :5000
    ```
    หากมีการทำงานอยู่ให้ kill ทิ้งเเล้วลองรัน Backend ใหม่
    ```base
    kill -9 <Process ID>
    ```

3. **ปัญหาที่ Port 3306** : เช็คว่า Process ของ MySQL Port 3306 ทำงานอยู่ไหม?
    ``` py
    # คำสั่งไหนก็ได้ แต่แนะนำดูที่ Docker ก่อน

    docker ps -a

    ps aux | grep 3306

    lsof -i :3306
    ```
    หากมีการทำงานอยู่ให้ลบทิ้งเเล้วลองรัน MySQL ใหม่
    ```base
    docker rm -f <Container Name>
    ```