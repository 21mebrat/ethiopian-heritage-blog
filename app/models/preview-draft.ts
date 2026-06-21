import { Schema, model, models } from "mongoose";

export interface IPreviewDraft {
  previewId: string;
  previewSecret: string;
  title: string;
  content: unknown;
  coverImage: string | null;
  tags: string[];
  categoryName: string | null;
  authorName: string | null;
  expiresAt: Date;
  createdAt: Date;
}

const PreviewDraftSchema = new Schema<IPreviewDraft>(
  {
    previewId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    previewSecret: {
      type: String,
      required: true,
    },
    title: { type: String, default: "Untitled" },
    content: { type: Schema.Types.Mixed, required: true },
    coverImage: { type: String, default: null },
    tags: { type: [String], default: [] },
    categoryName: { type: String, default: null },
    authorName: { type: String, default: null },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

const PreviewDraft =
  models.PreviewDraft || model<IPreviewDraft>("PreviewDraft", PreviewDraftSchema);

export default PreviewDraft;
