import { describe, expect, it } from "vitest";
import { entitlements } from "@/lib/entitlements";
describe("plan entitlements",()=>{it("does not allow free commerce",()=>expect(entitlements.free.products).toBe(false));it("allows Pro commerce and advanced appearance",()=>{expect(entitlements.pro.products).toBe(true);expect(entitlements.pro.advancedAppearance).toBe(true)});it("keeps link limits explicit",()=>expect(entitlements.business.links).toBeGreaterThan(entitlements.pro.links));});
