from flask import Flask, jsonify, request
import asyncio
from playwright.async_api import async_playwright
import requests
import json
import time
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # This will allow all origins by default

# Global cache for the bearer token
bearer_token_cache = {
    "token": None,  # Store the fetched token
    "expires_at": 0  # Store the token's expiration timestamp
}

# Function to fetch the bearer token using Playwright
async def fetch_bearer_token():
    async with async_playwright() as p:
        browser = await p.chromium.launch(proxy={
            "server": "rp.scrapegw.com:6060",
            "username": "hxz9qgkiv1ihrxp-country-ca-city-toronto",
            "password": "t6bbs2ddwi3qq8g"
        }, headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        bearer_token = None

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
        
        await page.goto(
            "https://thescore.bet/sport/football/organization/united-states/competition/nfl",
            wait_until="domcontentloaded",
            timeout=120000
        )

        await asyncio.sleep(5)
        await browser.close()

        return bearer_token


# Fetch marketplace data function
def fetch_marketplace_data(bearer, canonical_url):
    url = "https://sportsbook-tsb.ca-on.thescore.bet/graphql/persisted_queries/1dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8ab1ffad89e"
    headers = {
        "x-anonymous-authorization": bearer,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://thescore.bet/",
        "accept": "application/json",
        "origin": "https://thescore.bet",
    }
    payload = {
        "operationName": "Marketplace",
        "variables": {
            "includeSectionDefaultField": True,
            "includeDefaultChild": True,
            "includeTableMarketCard": True,
            "isAdhocCarouselEnabled": False,
            "isCfpRankingEnabled": True,
            "includeStandardizedBoxscore": False,
            "isBrandingImageEnabled": False,
            "isNewFeaturedBetParticipantLogoEnabled": False,
            "isNewPropsCarouselParticipantLogoEnabled": False,
            "canonicalUrl": canonical_url,
            "filterInput": None,
            "oddsFormat": "EURO",  # Set to a valid value
            "pageType": "PAGE",
            "includeRichEvent": True,
            "includeMediaUrl": False,  # Set to a valid value
            "selectedFilterId": "",
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "1dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8ab1ffad89e",
            }
        },
    }

    proxy_url = "http://hxz9qgkiv1ihrxp-country-ca-state-ontario-session-9bae8zmopc-lifetime-1:t6bbs2ddwi3qq8g@rp.scrapegw.com:6060"

    proxies = {
        "http": proxy_url,
        "https": proxy_url,
    }

    response = requests.post(url, headers=headers, json=payload, proxies=proxies)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}")

# Flask route to fetch the bearer token
@app.route('/fetch_token', methods=['GET'])
def fetch_token_route():
    global bearer_token_cache
    current_time = time.time()

    if bearer_token_cache["token"] and current_time < bearer_token_cache["expires_at"]:
        print("Returning cached bearer token.")
        return jsonify({
            "success": True,
            "token": bearer_token_cache["token"],
            "cached": True
        }), 200

    try:
        print("Fetching a new bearer token...")
        new_token = asyncio.run(fetch_bearer_token())
        if new_token:
            bearer_token_cache["token"] = new_token
            bearer_token_cache["expires_at"] = current_time + 3600
            return jsonify({
                "success": True,
                "token": new_token,
                "cached": False
            }), 200
        else:
            return jsonify({"success": False, "message": "Failed to fetch bearer token"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# Flask route to fetch marketplace data
@app.route('/fetch_market_data', methods=['GET'])
def fetch_market_data_route():
    """
    Fetch marketplace data using the canonical URL and cached bearer token.
    """
    global bearer_token_cache
    canonical_url = request.args.get('canonical_url')

    if not canonical_url:
        return jsonify({"success": False, "message": "Missing 'canonical_url' parameter"}), 400

    current_time = time.time()

    # Check if we have a valid cached token
    if not bearer_token_cache["token"] or current_time >= bearer_token_cache["expires_at"]:
        print("Token expired or not available. Fetching a new token...")
        try:
            bearer_token_cache["token"] = asyncio.run(fetch_bearer_token())
            bearer_token_cache["expires_at"] = current_time + 3600
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    try:
        # Use the token to fetch marketplace data
        data = fetch_marketplace_data(bearer_token_cache["token"], canonical_url)
        return jsonify({"success": True, "data": data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/')
def home():
    return "Flask server is running! Use /fetch_token or /fetch_market_data to interact with the API."


if __name__ == '__main__':
    app.run(debug=True)
 