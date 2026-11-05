"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-state";
import { isValidDateString } from "@/lib/date";
import { getDb } from "@/lib/db";

const MAX_ITEM_LENGTH = 300;
const MAX_TEMPLATE_LENGTH = 4000;

function errorResult(message: string): ActionResult {
  return { status: "error", message, at: Date.now() };
}

function successResult(message: string): ActionResult {
  return { status: "success", message, at: Date.now() };
}

function cleanContent(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function readKind(value: FormDataEntryValue | null): "completed" | "planned" | null {
  return value === "completed" || value === "planned" ? value : null;
}

export async function addItemAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const date = formData.get("date");
  const kind = readKind(formData.get("kind"));
  const content = cleanContent(formData.get("content"));

  if (!isValidDateString(date)) {
    return errorResult("日期无效，请刷新页面后重试。");
  }

  if (!kind) {
    return errorResult("记录类型无效。");
  }

  if (!content) {
    return errorResult("先写点内容再添加。");
  }

  if (content.length > MAX_ITEM_LENGTH) {
    return errorResult(`单条内容最多 ${MAX_ITEM_LENGTH} 个字。`);
  }

  try {
    const db = await getDb();
    await db
      .prepare(
        `INSERT INTO report_items (id, item_date, kind, content, sort_order)
         VALUES (?, ?, ?, ?, (
           SELECT COALESCE(MAX(sort_order), 0) + 1
           FROM report_items
           WHERE item_date = ? AND kind = ?
         ))`,
      )
      .bind(crypto.randomUUID(), date, kind, content, date, kind)
      .run();

    revalidatePath("/daily-report");
    return successResult(kind === "completed" ? "已记录，会出现在明天的日报里。" : "已加入今日计划。");
  } catch (error) {
    console.error("addItemAction failed", error);
    return errorResult("保存失败，请稍后重试。如果还没初始化数据库，请先运行迁移。");
  }
}

export async function updateItemAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const id = formData.get("id");
  const content = cleanContent(formData.get("content"));

  if (typeof id !== "string" || !id) {
    return errorResult("记录不存在。");
  }

  if (!content) {
    return errorResult("内容不能为空，可以直接删除这条记录。");
  }

  if (content.length > MAX_ITEM_LENGTH) {
    return errorResult(`单条内容最多 ${MAX_ITEM_LENGTH} 个字。`);
  }

  try {
    const db = await getDb();
    const result = await db
      .prepare("UPDATE report_items SET content = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(content, id)
      .run();

    if (!result.meta.changes) {
      return errorResult("记录不存在，可能已经被删除。");
    }

    revalidatePath("/daily-report");
    return successResult("已更新。");
  } catch (error) {
    console.error("updateItemAction failed", error);
    return errorResult("更新失败，请稍后重试。");
  }
}

export async function deleteItemAction(formData: FormData): Promise<void> {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return;
  }

  try {
    const db = await getDb();
    await db.prepare("DELETE FROM report_items WHERE id = ?").bind(id).run();
    revalidatePath("/daily-report");
  } catch (error) {
    console.error("deleteItemAction failed", error);
    throw new Error("删除失败，请稍后重试。");
  }
}

export async function saveTemplateAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const template = formData.get("template");

  if (typeof template !== "string" || !template.trim()) {
    return errorResult("模板不能为空。");
  }

  if (template.length > MAX_TEMPLATE_LENGTH) {
    return errorResult(`模板最多 ${MAX_TEMPLATE_LENGTH} 个字符。`);
  }

  try {
    const db = await getDb();
    await db
      .prepare(
        `INSERT INTO app_settings (key, value, updated_at)
         VALUES ('report_template', ?, datetime('now'))
         ON CONFLICT(key) DO UPDATE SET
           value = excluded.value,
           updated_at = datetime('now')`,
      )
      .bind(template)
      .run();

    revalidatePath("/daily-report");
    return successResult("模板已保存，日报预览已同步更新。");
  } catch (error) {
    console.error("saveTemplateAction failed", error);
    return errorResult("保存模板失败，请稍后重试。");
  }
}
