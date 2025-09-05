// src/server/db/schema.ts
import {
  pgTable, uuid, text, jsonb, timestamp, integer, boolean,
  pgEnum, index, primaryKey, real
} from "drizzle-orm/pg-core";
import { vector } from "drizzle-orm/pg-core"; // pgvector
import { relations } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

// ----------------------
// Enums
// ----------------------
export const workspaceType = pgEnum("workspace_type", ["personal", "course"]);
export const visibility = pgEnum("visibility", ["private", "unlisted", "public"]);
export const roadmapStatus = pgEnum("roadmap_status", ["draft", "active", "completed"]);
export const masteryState = pgEnum("mastery_state", ["locked", "unlocked", "mastered"]);
export const boardType = pgEnum("board_type", ["whiteboard", "desmos", "chart"]);
export const tutorSessionType = pgEnum("tutor_session_type", ["drona", "deeptutor"]);
export const workspaceSourceKind = pgEnum("workspace_source_kind", ["session", "book", "document"]);

// Embedding model used for vectors
export const embeddingModel = pgEnum("embedding_model", [
  "text-embedding-3-small",   // 1536 dims
  "text-embedding-3-large",   // 3072 dims
]);

// NEW: user/library document kinds
export const docKind = pgEnum("doc_kind", ["book", "slides", "notes", "paper"]);

// NEW: ingestion lifecycle for uploaded files
export const docIngestStatus = pgEnum("doc_ingest_status", [
  "uploaded", "processing", "indexed", "error",
]);

// WorkSpaces
export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    type: workspaceType("type").default("personal").notNull(),
    // Make owner required so RLS is simple & safe
    ownerProfileId: text("owner_profile_id").notNull(),
    settings: jsonb("settings"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at"),
  },
  (t) => [index("workspaces_owner_idx").on(t.ownerProfileId)],
);

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  notes: many(notes),
  roadmaps: many(roadmaps),
  workspaceBooks: many(workspaceBooks),
}));

// ----------------------
// Notes (Notion-like)
// ----------------------
export const notes = pgTable(
  "notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id, { onDelete: "cascade" })
      .notNull(),
    ownerProfileId: text("owner_profile_id").notNull(), // Clerk userId
    title: text("title"),
    content: jsonb("content").notNull(), // editor JSON (blocks/embeds)
    miniDronaEnabled: boolean("mini_drona_enabled").default(false).notNull(),
    roadmapId: uuid("roadmap_id"),
    topicId: uuid("topic_id"),
    provenance: jsonb("provenance"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("notes_workspace_idx").on(t.workspaceId),
    index("notes_topic_idx").on(t.topicId),
  ],
);

export const notesRelations = relations(notes, ({ one, many }) => ({
  workspace: one(workspaces, { fields: [notes.workspaceId], references: [workspaces.id] }),
  boards: many(boards),
}));

// ----------------------
// Roadmaps & Topics
// ----------------------
export const roadmaps = pgTable(
  "roadmaps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "set null" }),
    ownerProfileId: text("owner_profile_id").notNull(),
    title: text("title").notNull(),
    goal: text("goal"),
    totalHours: integer("total_hours"),
    status: roadmapStatus("status").default("draft").notNull(),
    visibility: visibility("visibility").default("private").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("roadmaps_workspace_idx").on(t.workspaceId)],
);

export const roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
  workspace: one(workspaces, { fields: [roadmaps.workspaceId], references: [workspaces.id] }),
  topics: many(roadmapTopics),
}));

export const roadmapTopics = pgTable(
  "roadmap_topics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    roadmapId: uuid("roadmap_id")
      .references(() => roadmaps.id, { onDelete: "cascade" })
      .notNull(),
    index: integer("index").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    estimatedHours: integer("estimated_hours"),
    prereqTopicIds: uuid("prereq_topic_ids").array(), // lightweight DAG
    masteryState: masteryState("mastery_state").default("locked").notNull(),
  },
  (t) => [index("roadmap_topics_roadmap_idx").on(t.roadmapId)],
);

export const roadmapTopicsRelations = relations(roadmapTopics, ({ one }) => ({
  roadmap: one(roadmaps, { fields: [roadmapTopics.roadmapId], references: [roadmaps.id] }),
}));

// ----------------------
// Boards (owned by a note; delete note => delete boards)
// ----------------------
export const boards = pgTable(
  "boards",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    noteId: uuid("note_id")
      .references(() => notes.id, { onDelete: "cascade" })
      .notNull(),
    type: boardType("type").notNull(), // 'whiteboard' | 'desmos' | 'chart'
    title: text("title"),
    data: jsonb("data").notNull(), // tldraw/Desmos/Plotly JSON
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("boards_note_idx").on(t.noteId),
    index("boards_type_idx").on(t.type),
  ],
);

export const boardsRelations = relations(boards, ({ one }) => ({
  note: one(notes, { fields: [boards.noteId], references: [notes.id] }),
}));

// ----------------------
// Tutor Sessions (Drona / DeepTutor) — minimal
// ----------------------
export const tutorSessions = pgTable("tutor_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: tutorSessionType("type").notNull(),
  ownerProfileId: text("owner_profile_id").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  metadata: jsonb("metadata"),
});

// ----------------------
// Books/Documents (catalog) + link to Workspace
// Supports both user-private uploads now and public library later.
// ----------------------
export const libraryBooks = pgTable(
  "library_books",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    author: text("author"),
    isbn: text("isbn"),
    description: text("description"),
    coverPath: text("cover_path"),
    // NEW: who owns this doc (user’s private) or your admin account (library)
    ownerProfileId: text("owner_profile_id").notNull(),
    // NEW: private by default; make 'public' when you publish to the library
    visibility: visibility("visibility").default("private").notNull(),
    // NEW: what kind of document (book/slides/notes/paper)
    kind: docKind("kind").default("book").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("lib_books_owner_idx").on(t.ownerProfileId),
    index("lib_books_visibility_idx").on(t.visibility),
    index("lib_books_kind_idx").on(t.kind),
  ],
);

export const workspaceBooks = pgTable(
  "workspace_books",
  {
    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id, { onDelete: "cascade" })
      .notNull(),
    bookId: uuid("book_id")
      .references(() => libraryBooks.id, { onDelete: "cascade" })
      .notNull(),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ name: "workspace_books_pkey", columns: [t.workspaceId, t.bookId] }),
  ],
);

// ----------------------
// Book files (uploads in Supabase Storage)
// ----------------------
export const libraryBookFiles = pgTable(
  "library_book_files",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookId: uuid("book_id")
      .references(() => libraryBooks.id, { onDelete: "cascade" })
      .notNull(),
    bucket: text("bucket").notNull(),      // e.g., "books"
    path: text("path").notNull(),          // e.g., "user123/abc.pdf"
    filename: text("filename").notNull(),
    mimeType: text("mime_type"),
    sizeBytes: integer("size_bytes"),
    pages: integer("pages"),
    sha256: text("sha256"),
    // NEW: track ingestion
    ingestStatus: docIngestStatus("ingest_status").default("uploaded").notNull(),
    lastIndexedAt: timestamp("last_indexed_at"),
    uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  },
  (t) => [
    index("book_files_book_idx").on(t.bookId),
    index("book_files_bucket_path_idx").on(t.bucket, t.path),
    index("book_files_status_idx").on(t.ingestStatus),
  ],
);

// ----------------------
// RAG: Chunks extracted from book files
// ----------------------
export const bookChunks = pgTable(
  "book_chunks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookId: uuid("book_id")
      .references(() => libraryBooks.id, { onDelete: "cascade" })
      .notNull(),
    fileId: uuid("file_id")
      .references(() => libraryBookFiles.id, { onDelete: "cascade" })
      .notNull(),
    chunkIndex: integer("chunk_index").notNull(),   // 0..N within file
    content: text("content").notNull(),             // normalized text
    tokens: integer("tokens"),
    section: text("section"),                       // chapter/heading
    pageFrom: integer("page_from"),
    pageTo: integer("page_to"),
    roadmapTopicId: uuid("roadmap_topic_id"),       // optional biasing for retrieval
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("book_chunks_book_idx").on(t.bookId),
    index("book_chunks_file_idx").on(t.fileId),
    index("book_chunks_topic_idx").on(t.roadmapTopicId),
  ],
);

// ----------------------
// RAG: Embeddings for chunks (pgvector)
// ----------------------
export const bookChunkEmbeddings = pgTable(
  "book_chunk_embeddings",
  {
    chunkId: uuid("chunk_id")
      .references(() => bookChunks.id, { onDelete: "cascade" })
      .notNull()
      .primaryKey(),
    embedding1536: vector("embedding_1536", { dimensions: 1536 }),
    model: embeddingModel("model").default("text-embedding-3-small").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    norm: real("norm"),
  },
  (t) => [index("embeddings_model_idx").on(t.model)],
);

// Relations for document tables
export const libraryBooksRelations = relations(libraryBooks, ({ many }) => ({
  files: many(libraryBookFiles),
  chunks: many(bookChunks),
  workspaceLinks: many(workspaceBooks),
}));

export const libraryBookFilesRelations = relations(libraryBookFiles, ({ one, many }) => ({
  book: one(libraryBooks, { fields: [libraryBookFiles.bookId], references: [libraryBooks.id] }),
  chunks: many(bookChunks),
}));

export const bookChunksRelations = relations(bookChunks, ({ one }) => ({
  book: one(libraryBooks, { fields: [bookChunks.bookId], references: [libraryBooks.id] }),
  file: one(libraryBookFiles, { fields: [bookChunks.fileId], references: [libraryBookFiles.id] }),
}));

// ----------------------
// Export handy types
// ----------------------
export type Workspace = InferSelectModel<typeof workspaces>;
export type NewWorkspace = InferInsertModel<typeof workspaces>;
export type Note = InferSelectModel<typeof notes>;
export type NewNote = InferInsertModel<typeof notes>;
export type Roadmap = InferSelectModel<typeof roadmaps>;
export type NewRoadmap = InferInsertModel<typeof roadmaps>;
export type RoadmapTopic = InferSelectModel<typeof roadmapTopics>;
export type NewRoadmapTopic = InferInsertModel<typeof roadmapTopics>;
export type Board = InferSelectModel<typeof boards>;
export type NewBoard = InferInsertModel<typeof boards>;
export type TutorSession = InferSelectModel<typeof tutorSessions>;
export type NewTutorSession = InferInsertModel<typeof tutorSessions>;
export type LibraryBook = InferSelectModel<typeof libraryBooks>;
export type NewLibraryBook = InferInsertModel<typeof libraryBooks>;
export type LibraryBookFile = InferSelectModel<typeof libraryBookFiles>;
export type NewLibraryBookFile = InferInsertModel<typeof libraryBookFiles>;
export type BookChunk = InferSelectModel<typeof bookChunks>;
export type NewBookChunk = InferInsertModel<typeof bookChunks>;
export type BookChunkEmbedding = InferSelectModel<typeof bookChunkEmbeddings>;
export type NewBookChunkEmbedding = InferInsertModel<typeof bookChunkEmbeddings>;
