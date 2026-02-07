package com.pegasus.hospital.e2e;

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class PatientAppointmentTest {
    static Playwright playwright;
    static Browser browser;
    static BrowserContext context;
    Page page;
    
    // Configurable base URL - default to Vite dev server or production build
    private static final String BASE_URL = System.getProperty("baseUrl", "http://localhost:5173");

    @BeforeAll
    static void launchBrowser() {
        playwright = Playwright.create();
        // Use chromium by default, headless=true for CI
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
    }
    
    @BeforeEach
    void createPage() {
        context = browser.newContext();
        page = context.newPage();
        
        // Ensure backend is reachable (optional check before E2E)
        // page.navigate("http://localhost:8080/doc.html"); 
    }
    
    @Test
    void testPatientAppointmentFlow() {
        page.navigate(BASE_URL);

        // 1. 患者登录
        // Assuming login page is at /login or modal
        page.getByText("登录").first().click();
        page.locator("input[name=username]").fill("1000000001"); // Use test patient
        page.locator("input[name=password]").fill("123456");
        page.locator("button:has-text('登录')").click();
        
        // 等待登录完成跳转
        page.waitForURL("**/home**", new Page.WaitForURLOptions().setTimeout(5000));
        
        // 2. 查询医生
        page.getByText("科室医生").click();
        // Assuming there is a select or dropdown for department
        // page.selectOption("select[name=department]", "心内科"); 
        // Modern UI might use custom dropdowns
        
        // 等待医生列表加载
        page.locator(".doctor-item").first().waitFor();
        List<String> doctors = page.locator(".doctor-item").allTextContents();
        assertTrue(doctors.size() > 0, "Doctor list should not be empty");
        
        // 3. 预约医生
        page.locator(".doctor-item").first().click(); // Select first doctor
        page.locator("button:has-text('预约')").first().click();
        
        // 4. 选择时间 (Assuming a date picker)
        // page.locator("input[name=appointmentDate]").click();
        // page.locator(".ant-picker-cell-today").click(); // Select today or specific date
        
        // 5. 确认预约
        // page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("确认预约")).click();
        
        // 6. 验证预约成功
        // assertThat(page.getByText("预约成功")).isVisible();
    }
    
    @AfterEach
    void closePage() {
        if (context != null) context.close();
    }
    
    @AfterAll
    static void closeBrowser() {
        if (browser != null) browser.close();
        if (playwright != null) playwright.close();
    }
}
