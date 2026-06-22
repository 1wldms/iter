from app import create_app

print("1. import done")

app = create_app()

print("2. app created")

if __name__ == '__main__':
    print("3. flask start")
    app.run(debug=True, port=5001)