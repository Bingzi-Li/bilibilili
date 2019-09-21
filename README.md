# bilibilili
A face-recognition-based attendance taking system

How to run:
1. Install MongoDB and ensure mongo service is running (https://stackoverflow.com/questions/9884233/mongodb-service-is-not-starting-up)
2. In the project directory, run "npm install" to install dependencies
3. Run "npm run dev" if you are in development mode or "npm run start" if you are in production mode

4. Open your chrome, visit "localhost:3000"
5. The default admin account is 
    username: admin@ntu.edu.sg
    password: admin123
6. The default staff account is
    username: frank@ntu.edu.sg
    password: ntuniubi
7. Admin and staff account are directed to different pages
8. For staff account, choose a session from the left side bar, then click "take attendance" button the top right corner. The browser will render an attendance-taking page. Click "start" button to start facial recognition. The browser may take a while to load carema and DL models before facial recognition. When it is done, click "End" button on the left side bar to go back to the attendance list page.