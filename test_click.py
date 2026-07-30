import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        errors = []
        page.on("pageerror", lambda err: errors.append(err))
        page.on("console", lambda msg: print(f"Console: {msg.text}") if msg.type == "error" else None)

        print("Navigating to app...")
        await page.goto("http://localhost:8000")
        
        # Log in as Estate Approver to see the table
        await page.click("#sidebar-signin-btn")
        await page.wait_for_selector("#login-modal.active")
        await page.select_option("#login-role", "approver-estate")
        await page.click("#login-submit-btn")
        
        print("Logged in. Navigating to Approvals Inbox...")
        await page.click(".nav-item[data-view='approvals']")
        await page.wait_for_selector("#approvals-table-body tr")

        # Try to click the first recurring booking Review Request button
        print("Finding Review Request button for B-REC-6001-2...")
        button = await page.query_selector("button[onclick=\"openApprovalModal('B-REC-6001-2')\"]")
        
        if not button:
            print("Button not found! Are we sure it's in the DOM?")
            print(await page.content())
        else:
            print("Button found! Clicking it...")
            await button.click()
            
            # Check if modal becomes active
            is_active = await page.evaluate('document.getElementById("approval-modal").classList.contains("active")')
            print(f"Modal active after click: {is_active}")
            
            if not is_active:
                print("Modal did not open!")
            else:
                print("Modal opened successfully!")
                
        if errors:
            print("Page Errors caught:")
            for e in errors:
                print(e)
                
        await browser.close()

asyncio.run(run())
