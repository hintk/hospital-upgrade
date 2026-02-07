package com.pegasus.hospital.e2e;

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class DoctorWorkstationTest {
    static Playwright playwright;
    static Browser browser;
    BrowserContext context;
    Page page;
    
    private static final String BASE_URL = System.getProperty("baseUrl", "http://localhost:5173");

    @BeforeAll
    static void launchBrowser() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
    }
    
    @BeforeEach
    void createPage() {
        context = browser.newContext();
        page = context.newPage();
    }

    @Test
    void testDoctorLoginAndViewSchedule() {
        page.navigate(BASE_URL);
        
        // 医生登录
        page.getByText("登录").first().click();
        // Toggle to Doctor Login if necessary
        // page.getByText("医生登录").click();
        
        page.locator("input[name=username]").fill("2000000001"); // Test doctor
        page.locator("input[name=password]").fill("123456");
        page.locator("button:has-text('登录')").click();
        
        page.waitForURL("**/doctor/**");
        
        // 查看今日待诊
        // assertThat(page.getByText("待诊患者")).isVisible();
        
        // Check schedule list
        // assertTrue(page.locator(".appointment-item").count() >= 0);
    }

    @AfterEach
    void closePage() {
        context.close();
    }
    
    @AfterAll
    static void closeBrowser() {
        browser.close();
        playwright.close();
    }
}
