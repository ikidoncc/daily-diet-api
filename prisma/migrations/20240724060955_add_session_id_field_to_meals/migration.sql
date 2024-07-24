/*
  Warnings:

  - Added the required column `session_id` to the `meals` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_meals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "is_on_diet" BOOLEAN NOT NULL DEFAULT false,
    "session_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_meals" ("created_at", "date", "description", "id", "is_on_diet", "name") SELECT "created_at", "date", "description", "id", "is_on_diet", "name" FROM "meals";
DROP TABLE "meals";
ALTER TABLE "new_meals" RENAME TO "meals";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
