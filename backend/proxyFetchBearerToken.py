import asyncio
from playwright.async_api import async_playwright
import requests
import json

async def fetch_bearer_token():
    async with async_playwright() as p:

        # Launch the browser (headless for automation)
        browser = await p.chromium.launch(proxy = {
            "server" :"rp.scrapegw.com:6060",
            "username" : "hxz9qgkiv1ihrxp-country-ca-state-ontario-session-9bae8zmopc-lifetime-1",
            "password" : "t6bbs2ddwi3qq8g"
        }, headless=True)
        context = await browser.new_context()
        
        # Open a new page
        page = await context.new_page()

        # Variables to store the Bearer token and response length
        bearer_token = None
        response_logged = False
        

          # Intercept and block unnecessary requests
        
        # Intercept requests to filter specific URLs
        async def handle_request(route):
            nonlocal bearer_token
            request_url = route.request.url
            if request_url.startswith("https://sportsbook-tsb.ca-on.thescore.bet/graphql/") and not bearer_token:
                headers = route.request.headers
                if 'x-anonymous-authorization' in headers:
                    bearer_token = headers['x-anonymous-authorization']
                    print("Bearer Token:", bearer_token)  # Print the token
            await route.continue_()

        # Enable request interception only for the desired domain
        await context.route("https://sportsbook-tsb.ca-on.thescore.bet/graphql/**", handle_request)

        # Log response content length only once
        async def log_response_length(response):
            nonlocal response_logged
            try:
                if response.url.startswith("https://sportsbook-tsb.ca-on.thescore.bet/graphql/") and not response_logged:
                    body = await response.body()
                    print(f"Response URL: {response.url}")
                    print(f"Response Length: {len(body)} bytes")
                    response_logged = True  # Mark as logged
            except Exception as e:
                print(f"Error fetching response body: {e}")

        # Listen for responses
        #page.on("response", lambda response: asyncio.create_task(log_response_length(response)))

        # Navigate to the target website
        await page.goto(
            "https://thescore.bet/sport/football/organization/united-states/competition/nfl/event/22db3d9e-3d43-4e77-8810-2d50b5174424",
            wait_until="domcontentloaded",  # Wait until the DOM is loaded
            timeout=60000  # Set timeout to 60 seconds
        )
        # Wait for a few seconds to ensure all requests are processed
        await asyncio.sleep(10)

        # Close the browser
        await browser.close()

        if bearer_token:
            print("Bearer token successfully fetched.")
            canonical_url = "https://thescore.bet/sport/basketball/organization/united-states/competition/nba"
            fetch_marketplace_data(bearer_token, canonical_url)
        else:
            print("Bearer token not found.")







def fetch_marketplace_data(bearer, canonical_url):
    # Base URL for the GraphQL endpoint
    url = "https://sportsbook-tsb.ca-on.thescore.bet/graphql/persisted_queries/1dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8ab1ffad89e"

    # Headers copied from the Network tab
    headers = {
        "x-anonymous-authorization": bearer,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Referer": "https://thescore.bet/",
        "accept": "application/json",
        "origin": "https://thescore.bet",
        "cookie": "__cf_bm=...; _cfuvid=...; _gcl_au=...; thescore_id_web_bettingthescore.bet=...",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "priority": "u=1, i",
        "x-app": "tsb",
        "x-app-version": "25.2.0",
        "x-client": "tsb",
    }

    # JSON payload to send with the POST request
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
            "oddsFormat": "EURO",
            "pageType": "PAGE",
            "includeRichEvent": True,
            "includeMediaUrl": False,
            "selectedFilterId": "",
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "1dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8ab1ffad89e",
            }
        },
    }

    # Proxy configuration
    proxy_url = "http://hxz9qgkiv1ihrxp-country-ca-state-ontario-session-9bae8zmopc-lifetime-1:t6bbs2ddwi3qq8g@rp.scrapegw.com:6060"

    proxies = {
        "http": proxy_url,
        "https": proxy_url,
    }

    # Send the POST request through the proxy
    response = requests.post(url, headers=headers, json=payload, proxies=proxies)

    # Check response status
    if response.status_code == 200:
        # Get the content length
        content_length = len(response.content)
        print(f"Content length: {content_length} bytes")

        # Save the response to a file
        data = response.json()
        with open("response.json", "w") as f:
            json.dump(data, f, indent=4)  # Save the JSON response with indentation
        print("Data saved to response.json")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)



asyncio.run(fetch_bearer_token())
