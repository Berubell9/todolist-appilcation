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