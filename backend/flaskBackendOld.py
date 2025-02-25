from flask import Flask, jsonify
import asyncio
from playwright.async_api import async_playwright
import time

app = Flask(__name__)

# Global cache for the bearer token
bearer_token_cache = {
    "token": None,  # Store the fetched token
    "expires_at": 0  # Store the token's expiration timestamp
}

async def fetch_bearer_token():
    """
    Function to fetch the bearer token using Playwright.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(proxy={
            "server": "rp.scrapegw.com:6060",
            "username": "hxz9qgkiv1ihrxp-country-ca-state-ontario-session-9bae8zmopc-lifetime-1",
            "password": "t6bbs2ddwi3qq8g"
        }, headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        bearer_token = None

        # Intercept requests to find the bearer token
        async def handle_request(route):
            nonlocal bearer_token
            request_url = route.request.url
            if request_url.startswith("https://sportsbook-tsb.ca-on.thescore.bet/graphql/") and not bearer_token:
                headers = route.request.headers
                if 'x-anonymous-authorization' in headers:
                    bearer_token = headers['x-anonymous-authorization']
                    print("Fetched Bearer Token:", bearer_token)
            await route.continue_()

        await context.route("https://sportsbook-tsb.ca-on.thescore.bet/graphql/**", handle_request)
        
        # Navigate to the target page
        await page.goto(
            "https://thescore.bet/sport/football/organization/united-states/competition/nfl/event/22db3d9e-3d43-4e77-8810-2d50b5174424",
            wait_until="domcontentloaded",
            timeout=60000
        )

        # Allow some time for token interception
        await asyncio.sleep(5)
        await browser.close()

        return bearer_token


@app.route('/fetch_token', methods=['GET'])
def fetch_token_route():
    """
    Flask route to fetch a bearer token.
    Reuses the token if it has not expired.
    """
    global bearer_token_cache
    current_time = time.time()

    # Check if the token is still valid
    if bearer_token_cache["token"] and current_time < bearer_token_cache["expires_at"]:
        print("Returning cached bearer token.")
        return jsonify({
            "success": True,
            "token": bearer_token_cache["token"],
            "cached": True
        }), 200

    # Fetch a new token and update the cache
    try:
        print("Fetching a new bearer token...")
        new_token = asyncio.run(fetch_bearer_token())
        if new_token:
            bearer_token_cache["token"] = new_token
            bearer_token_cache["expires_at"] = current_time + 3600  # Token valid for 1 hour
            return jsonify({
                "success": True,
                "token": new_token,
                "cached": False
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Failed to fetch bearer token"
            }), 500
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/')
def home():
    return "Flask server is running! Use /fetch_token to fetch the bearer token."


if __name__ == '__main__':
    app.run(debug=True)
