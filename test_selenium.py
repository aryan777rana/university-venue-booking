from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def run_test():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    try:
        driver = webdriver.Chrome(options=options)
    except Exception as e:
        print(f"Could not start Chrome: {e}")
        return

    driver.get("http://localhost:8000")
    
    # Capture console logs
    driver.execute_script("""
        window.myLogs = [];
        console.error = function(message) { window.myLogs.push("ERROR: " + message); };
        console.warn = function(message) { window.myLogs.push("WARN: " + message); };
        console.log = function(message) { window.myLogs.push("LOG: " + message); };
        window.onerror = function(msg, url, line) { window.myLogs.push("EXCEPTION: " + msg + " at line " + line); };
    """)

    time.sleep(1)
    
    # Login as approver
    try:
        driver.find_element(By.ID, "sidebar-signin-btn").click()
        time.sleep(0.5)
        driver.find_element(By.CSS_SELECTOR, "#login-role option[value='approver-estate']").click()
        driver.find_element(By.ID, "login-submit-btn").click()
        time.sleep(0.5)
        
        # Navigate to Approvals
        driver.find_element(By.CSS_SELECTOR, ".nav-item[data-view='approvals']").click()
        time.sleep(1)
        
        # Click Review Request for B-REC-6001-2
        btn = driver.find_element(By.CSS_SELECTOR, "button[onclick=\"openApprovalModal('B-REC-6001-2')\"]")
        btn.click()
        time.sleep(1)
        
        # Check if modal is active
        modal = driver.find_element(By.ID, "approval-modal")
        classes = modal.get_attribute("class")
        print(f"Modal classes: {classes}")
        
    except Exception as e:
        print(f"Test failed: {e}")
        
    finally:
        logs = driver.execute_script("return window.myLogs;")
        print("Console Logs:")
        for log in logs:
            print(log)
        driver.quit()

if __name__ == "__main__":
    run_test()
