import { test, expect } from "@playwright/test";
test("landing page exposes primary conversion actions",async({page})=>{await page.goto("/");await expect(page.getByRole("heading",{name:/Everything you are/i})).toBeVisible();await expect(page.getByRole("link",{name:/Get Started/i}).first()).toBeVisible();});
test("demo public profile is responsive when demo mode is enabled",async({page})=>{await page.goto("/selamstudio");await expect(page.getByRole("heading",{name:"Selam Studio"})).toBeVisible();await expect(page.getByText("Demo profile")).toBeVisible();});
test("private application path redirects unauthenticated users",async({page})=>{await page.goto("/dashboard");await expect(page).toHaveURL(/\/login/);});
