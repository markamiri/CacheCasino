import asyncio
from playwright.async_api import async_playwright
import requests
import json
from siteScrape import fetch_marketplace_data

async def fetch_bearer_token_with_proxy():
    # Sticky proxy configuration
    proxy = {
        "server": "rp.scrapegw.com:6060",  # Proxy server and port
        "username": "hxz9qgkiv1ihrxp-country-ca-session-4vz1jn5oss-lifetime-2",  # Proxy username
        "password": "t6bbs2ddwi3qq8g"  # Proxy password
    }

    async with async_playwright() as p:
        # Launch the browser with proxy settings in headless mode
        browser = await p.chromium.launch(
            headless=True,  # Run in headless mode
            proxy=proxy
        )
        context = await browser.new_context()
        page = await context.new_page()

        # Variable to store the Bearer token
        bearer_token = None

        # Intercept requests to filter specific URLs
        async def handle_request(route):
            nonlocal bearer_token
            request_url = route.request.url
            if request_url.startswith("https://sportsbook-tsb.ca-on.thescore.bet/graphql/") and not bearer_token:
                headers = route.request.headers
                if 'x-anonymous-authorization' in headers:
                    bearer_token = headers['x-anonymous-authorization']
                    print(bearer_token)  # Print the token
            await route.continue_()

        # Enable request interception only for the desired domain
        await context.route("https://sportsbook-tsb.ca-on.thescore.bet/graphql/**", handle_request)

        # Navigate to the target website
        await page.goto(
            "https://thescore.bet/sport/football/organization/united-states/competition/nfl/event/22db3d9e-3d43-4e77-8810-2d50b5174424",
            timeout=90000  # 60 seconds timeout
        )

        # Wait for a few seconds to ensure all requests are processed
        await asyncio.sleep(5)

        # Close the browser

        if bearer_token:
            print("Bearer token successfully fetched.")
             # Call fetch_marketplace_data with the bearer token and canonical URL
            canonical_url = "/sport/basketball/organization/united-states/competition/nba/event/1fddc56e-4c4a-4530-a206-f3ae70b0e9e4"
            fetch_marketplace_data(bearer_token, canonical_url)
        else:
            print("Bearer token not found.")
        
        await browser.close()


# Run the function
asyncio.run(fetch_bearer_token_with_proxy())
