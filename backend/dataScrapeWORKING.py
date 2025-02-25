import asyncio
from playwright.async_api import async_playwright
import json

#Think about how we can 
async def fetch_graphql_response_with_proxy():
    # Sticky proxy configuration
    proxy = {
        "server": "rp.scrapegw.com:6060",  # Proxy server and port
        "username": "hxz9qgkiv1ihrxp-country-ca-session-uzrs32ib0a-lifetime-10",  # Proxy username
        "password": "t6bbs2ddwi3qq8g"  # Proxy password
    }

    async with async_playwright() as p:
        # Launch the browser with proxy settings in headless mode
        browser = await p.chromium.launch(
            headless=True,  # Run in headless mode
        )
        context = await browser.new_context()
        page = await context.new_page()

        # Variable to store the GraphQL response
        graphql_response = None

        # Intercept responses to capture the GraphQL response
        async def handle_response(response):
            nonlocal graphql_response
            if response.url.startswith("https://sportsbook-tsb.ca-on.thescore.bet/graphql/persisted_queries/1dbef7dadc3f48c7e02cdaf86376600c88d821ed83e32051a0e5c8a") and response.status == 200:
                try:
                    body = await response.json()
                    graphql_response = body
                    print("GraphQL Response captured!")
                    print(json.dumps(graphql_response, indent=4))  # Pretty print the JSON response
                except Exception as e:
                    print(f"Error capturing response: {e}")

        # Listen for responses
        page.on("response", handle_response)

        # Navigate to the target website
        await page.goto(
            "https://thescore.bet/sport/basketball/organization/united-states/competition/nba/event/85edcc7a-6860-46cb-847a-5265ee82d6fa",
            timeout=90000  # 90 seconds timeout
        )

        # Wait for a few seconds to ensure all requests are processed
        await asyncio.sleep(5)

        # Save the GraphQL response to a file if it was captured
        if graphql_response:
            with open("graphql_response.json", "w") as f:
                json.dump(graphql_response, f, indent=4)
            print("GraphQL response saved to graphql_response.json.")
        else:
            print("No GraphQL response captured.")

        # Close the browser
        await browser.close()

# Run the function
asyncio.run(fetch_graphql_response_with_proxy())
