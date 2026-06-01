import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

/** A single technology badge on a project card. */
export interface Technology {
  /** Display name, e.g. "TypeScript". */
  name: string;
  /** simple-icons slug, e.g. "typescript". Optional — falls back to the name. */
  icon?: string;
}

export const projectType = pgEnum("project_type", ["professional", "personal"]);

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: projectType("type").notNull(),

  // Shared fields.
  title: text("title").notNull(),
  description: text("description").notNull(),
  // `date` so ordering is purely by calendar day; stored as ISO string.
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  technologies: jsonb("technologies")
    .$type<Technology[]>()
    .notNull()
    .default([]),

  // Professional-only.
  organization: text("organization"),
  organizationIcon: text("organization_icon"),
  role: text("role"),

  // Personal-only.
  imageUrl: text("image_url"),
  link: text("link"),
  githubLink: text("github_link"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
