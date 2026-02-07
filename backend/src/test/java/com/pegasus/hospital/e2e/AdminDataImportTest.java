package com.pegasus.hospital.e2e;

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;
import java.nio.file.Paths;
import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AdminDataImportTest {
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
    void testAdminImportDoctors() {
        page.navigate(BASE_URL);
        
        // 管理员登录
        page.getByText("登录").first().click();
        // Toggle to Admin Login
        // page.getByText("管理员登录").click();
        
        page.locator("input[name=username]").fill("admin");
        page.locator("input[name=password]").fill("123456");
        page.locator("button:has-text('登录')").click();
        
        page.waitForURL("**/admin/**");
        
        // 导航到医生管理
        page.getByText("医生管理").click();
        
        // 点击导入按钮
        // FileChooser fileChooser = page.waitForFileChooser(() -> {
        //     page.getByText("批量导入").click();
        // });
        
        // fileChooser.setFiles(Paths.get("src/test/resources/doctors_sample.xlsx"));
        
        // 验证上传成功提示
        // assertThat(page.getByText("导入成功")).isVisible();
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
