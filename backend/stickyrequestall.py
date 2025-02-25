import asyncio
from playwright.async_api import async_playwright

async def fetch_all_requests():
    proxy = {
        "server": "rp.scrapegw.com:6060",  # Proxy server and port
        "username": "hxz9qgkiv1ihrxp",  # Proxy username
        "password": "t6bbs2ddwi3qq8g"  # Proxy password
    }

    async with async_playwright() as p:
        # Launch the browser with proxy settings
        browser = await p.chromium.launch(
            headless=True,
            proxy=proxy
        )
        context = await browser.new_context()
        page = await context.new_page()

        # Log all outgoing requests
        async def handle_request(route):
            request_url = route.request.url
            headers = route.request.headers
            print(f"Request URL: {request_url}")
            print(f"Headers: {headers}")
            print("=" * 50)
            await route.continue_()

        # Enable request interception for all fetches
        await context.route("**/*", handle_request)

        # Navigate to the target URL
        await page.goto("https://thescore.bet/sport/football/organization/united-states/competition/nfl/event/22db3d9e-3d43-4e77-8810-2d50b5174424")
        await asyncio.sleep(5)  # Wait for requests to process

        # Close the browser
        await browser.close()

# Run the function
asyncio.run(fetch_all_requests())
