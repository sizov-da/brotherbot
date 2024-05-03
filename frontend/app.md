TODO my project

# frontend/app.md
1) Telegram authentication (connect to the bot)
2) push to server (socket.io) telegram id and token (hash)
3) save to local storage (telegram id and hash)
4) if logout - delete from local storage and user present login as yor telegram profile

# login logic in file 

    frontend/src/Components/MainPage.tsx

1) check local storage for user
2) if user not present - show login page a /AuthPage
3) if user present - show main page
