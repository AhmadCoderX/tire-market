from pyngrok import ngrok
import time

def start_ngrok():
    # Open a ngrok tunnel to the HTTP server
    public_url = ngrok.connect(8000, bind_tls=True)
    print(f'\n=== Ngrok Tunnel Created ===')
    print(f'Public URL: {public_url}')
    print(f'===========================\n')
    print('Keep this window open while you are developing!\n')
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down ngrok...")
        ngrok.kill()

if __name__ == "__main__":
    start_ngrok()