import asyncio
import platform
from fastapi import FastAPI, HTTPException
from playwright.async_api import async_playwright
import requests
import json
import time
from urllib.parse import urlparse

if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = FastAPI()

bearer_token_cache = {
    "token": None,
    "expires_at": -1,  # Unix timestamp of when the token expires
}

@app.get("/")
def read_root():
    return {"message": "Welcome to tailed API"}

@app.get("/fetch_data")
async def fetch_data(canonical_url: str):
    parsed_url = urlparse(canonical_url)
    if not (parsed_url.scheme and parsed_url.netloc):
        raise HTTPException(status_code=400, detail="Invalid URL provided")
    try:
        bearer_token = await get_bearer_token()
        if not bearer_token:
            raise HTTPException(status_code=500, detail="Bearer Token not found")

        data = fetch_marketplace_data(bearer_token, canonical_url)
        return {"message": "Data fetched successfully", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def fetch_bearer_token():
    try:
        # Connect to the MCP server
        async with async_playwright() as p:
            browser = await p.chromium.connect_over_cdp("ws://localhost:65272/")  # MCP server WebSocket URL
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
                await route.continue_()

            # Intercept requests to fetch the token
            await context.route("https://sportsbook-tsb.ca-on.thescore.bet/graphql/**", handle_request)
            
            # Navigate to the target page
            await page.goto(
                "https://thescore.bet/sport/football/organization/united-states/competition/nfl/event/22db3d9e-3d43-4e77-8810-2d50b5174424",
                wait_until="domcontentloaded", timeout=60000
            )
            
            # Wait for the bearer token to be captured
            await asyncio.sleep(5)
            await context.close()

            return bearer_token
    except Exception as e:
        print(f"Error fetching bearer token: {e}")
        return None



async def get_bearer_token():
    """
    Returns the cached bearer token if valid; otherwise fetches a new one.
    """
    global bearer_token_cache
    current_time = time.time()
    if current_time >= bearer_token_cache["expires_at"]:
        print("Fetching a new token...")
        # Fetch a new token and update the cache
        new_token = await fetch_bearer_token()
        bearer_token_cache["token"] = new_token
        bearer_token_cache["expires_at"] = current_time + 3600  # Valid for 1 hour
    else:
        print("Using cached token...")
    return bearer_token_cache["token"]


def fetch_marketplace_data(bearer, canonical_url):
    url = "https://sportsbook-tsb.ca-on.thescore.bet/graphql/persisted_queries/1dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8ab1ffad89e"
    headers = {
        "x-anonymous-authorization": bearer,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
    }
    payload = {
        "operationName": "Marketplace",
        "variables": {
            "canonicalUrl": canonical_url,
            "includeRichEvent": True,
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "1dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8ab1ffad89e",
            }
        },
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch data: {response.status_code}, {response.text}")
