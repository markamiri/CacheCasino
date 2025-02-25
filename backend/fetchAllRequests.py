import asyncio
from playwright.async_api import async_playwright

async def fetch_all_requests():
    async with async_playwright() as p:
        # Launch the browser (headless for automation)
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Log all outgoing requests
        async def handle_request(route):
            request_url = route.request.url
            headers = route.request.headers
            method = route.request.method
            post_data = route.request.post_data  # For POST requests
            print(f"Request URL: {request_url}")
            print(f"Request Method: {method}")
            print(f"Headers: {headers}")
            if post_data:
                print(f"Post Data: {post_data}")
            print("=" * 50)
            await route.continue_()

        # Enable request interception for all requests
        await context.route("**/*", handle_request)

        # Navigate to the target website
        await page.goto("https://thescore.bet/sport/football/organization/united-states/competition/nfl/event/22db3d9e-3d43-4e77-8810-2d50b5174424")

        # Wait for a few seconds to ensure all requests are logged
        await asyncio.sleep(5)

        # Close the browser
        await browser.close()

# Run the function
asyncio.run(fetch_all_requests())
